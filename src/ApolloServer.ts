import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  ApolloServerBase,
  PlaygroundRenderPageOptions,
} from "apollo-server-core";
import { renderPlaygroundPage } from "@apollographql/graphql-playground-html";
import { RouterContract } from "@ioc:Adonis/Core/Route";
import { ServerContract } from "@ioc:Adonis/Core/Server";
import WebSocket from "ws";
import {
  AdonisConfig,
  AdonisConnectionContext,
  AdonisIncomingMessage,
  ApolloServerContract,
} from "@ioc:Apollo/Server";
import { graphqlAdonis } from "./graphqlAdonis";

export default class ApolloServer
  extends ApolloServerBase
  implements ApolloServerContract {
  static defaultRoute: RouterContract;

  public static subscriptionInstallers: ((
    server: ServerContract
  ) => void)[] = [];
  protected wsServer?: WebSocket.Server;

  public constructor(options: AdonisConfig) {
    super({
      context: (context) => {
        if (context.connection) {
          return context.connection.context;
        } else {
          return context.ctx;
        }
      },
      ...options,
      subscriptions:
        options.subscriptions === false
          ? false
          : {
              onConnect: async (
                connectionParams,
                _webSocket,
                { request: { adonisContext: ctx } }: AdonisConnectionContext
              ) => {
                for (const key in connectionParams) {
                  ctx.request.request.headers[
                    key.toLowerCase()
                  ] = (connectionParams as any)[key];
                }
                return ctx;
              },
              ...options.subscriptions,
            },
    });
  }

  public routes({
    Route = ApolloServer.defaultRoute,
    playground = false,
    path = "/graphql",
    subscriptions = false,
  }: {
    Route: RouterContract;
    playground?: boolean;
    path?: string;
    subscriptions: boolean;
  }) {
    if (subscriptions) {
      this.installSubscriptionHandlers();
    }
    return Route.group(() => {
      Route!.route(path, ["GET", "POST"], (ctx: HttpContextContract) => {
        return this.handle(ctx);
      });
      if (playground) {
        Route!.get(`${path}/playground`, () =>
          this.renderPlayground({ endpoint: path, subscriptionEndpoint: path })
        );
      }
    });
  }

  protected supportsSubscriptions() {
    return true;
  }

  public handle(ctx: HttpContextContract) {
    return new Promise(async (resolve) => {
      if (ctx.request.header("upgrade") == "websocket") {
        if (!this.wsServer) {
          throw new Error(
            "You need to call `ApolloServer.installSubscriptionHandlers` before you are connecting with Websocket!"
          );
        }
        this.wsServer.handleUpgrade(
          ctx.request.request,
          ctx.request.request.socket,
          Buffer.from(""),
          (ws) => {
            const request = ctx.request.request as AdonisIncomingMessage;
            request.adonisContext = ctx;
            this.wsServer!.emit("connection", ws, request);
          }
        );
      } else {
        resolve(
          await graphqlAdonis(ctx, await this.createGraphQLServerOptions(ctx))
        );
      }
    });
  }

  async renderPlayground(options: PlaygroundRenderPageOptions = {}) {
    return renderPlaygroundPage({
      ...this.playgroundOptions,
      ...options,
    });
  }

  protected async createGraphQLServerOptions(ctx: HttpContextContract) {
    return super.graphQLServerOptions({ ctx });
  }

  public installSubscriptionHandlers() {
    this.wsServer = new WebSocket.Server({ noServer: true });
    return super.installSubscriptionHandlers(this.wsServer);
  }
}
