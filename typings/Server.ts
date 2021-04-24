declare module "@ioc:Apollo/Server" {
  import { ConnectionContext } from "subscriptions-transport-ws";
  import { IncomingMessage } from "http";
  import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
  import {
    Config,
    SubscriptionServerOptions,
    ApolloServerBase,
    PlaygroundRenderPageOptions,
  } from "apollo-server-core";
  import WebSocket from "ws";
  import { RouterContract } from "@ioc:Adonis/Core/Route";

  export class ApolloServerContract extends ApolloServerBase {
    handle(ctx: HttpContextContract): Promise<unknown>;
    renderPlayground(options: PlaygroundRenderPageOptions): Promise<string>;
    installSubscriptionHandlers(): void;
    routes(options?: {
      Route?: RouterContract;
      playground?: boolean;
      path?: string;
      subscriptions?: boolean;
    }): void;
  }

  export interface AdonisIncomingMessage extends IncomingMessage {
    adonisContext: HttpContextContract;
  }

  export interface AdonisConnectionContext extends ConnectionContext {
    request: AdonisIncomingMessage;
  }

  export interface AdonisSubscriptionServerOptions
    extends SubscriptionServerOptions {
    onConnect: (
      connectionParams: Object,
      websocket: WebSocket,
      context: AdonisConnectionContext
    ) => any;
  }

  export interface AdonisConfig extends Config {
    subscriptions?: Partial<AdonisSubscriptionServerOptions> | false;
  }

  const ApolloServer: typeof ApolloServerContract;
  export default ApolloServer;
}
