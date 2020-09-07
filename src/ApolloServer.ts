import "reflect-metadata"
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApolloServerBase } from "apollo-server-core"
import { renderPlaygroundPage } from '@apollographql/graphql-playground-html'
import { RouterContract } from '@ioc:Adonis/Core/Route'
import { ServerContract } from '@ioc:Adonis/Core/Server'
import WebSocket from 'ws'
import { AdonisConfig, AdonisConnectionContext, AdonisIncomingMessage, ApolloServerContract } from '@ioc:Apollo/Server'
import { graphqlAdonis } from "./graphqlAdonis"

export default class ApolloServer extends ApolloServerBase implements ApolloServerContract {
  public static subscriptionInstallers: ((server: ServerContract) => void)[] = [];
  protected wsServer?: WebSocket.Server

  public constructor(options: AdonisConfig) {
    super({
      context: (context) => {
          if(context.connection) {
              return context.connection.context
          } else {
              return context.ctx
          }
      },
      ...options,
      subscriptions: options.subscriptions === false ? false : {
        onConnect: async (connectionParams, _webSocket, { request: { adonisContext: ctx } }: AdonisConnectionContext) => {
          for(const key in connectionParams) {
              ctx.request.request.headers[key.toLowerCase()] = (connectionParams as any)[key]
          }
          return ctx
        },
        ...options.subscriptions
      },
    })
  }

  public applyMiddleware(Router: RouterContract) {
    this.willStart()
    return Router.group(this.getGroup(Router))
  }

  protected supportsSubscriptions() {
    return true
  }

  public getGroup(Router: RouterContract) {
    return () => {
      Router.any('/graphql', (ctx: HttpContextContract) => {
        return new Promise(async resolve => {
          if(ctx.request.header('upgrade') == 'websocket') {
            if(!this.wsServer) {
              throw new Error('You need to call `ApolloServer.installSubscriptionHandlers` before you are connecting with Websocket!')
            }
            this.wsServer.handleUpgrade(ctx.request.request, ctx.request.request.socket, Buffer.from(""), ws => {
              const request = ctx.request.request as AdonisIncomingMessage
              request.adonisContext = ctx
              this.wsServer!.emit('connection', ws, request)
            })
          } else {
            resolve(await graphqlAdonis(ctx, await this.createGraphQLServerOptions(ctx)))
          }
        })
      })
      Router.get('/graphql/playground', async () => renderPlaygroundPage({
        endpoint: '/graphql',
        subscriptionEndpoint: '/graphql',
        ...this.playgroundOptions,
      }))
    }
  }

  protected async createGraphQLServerOptions(ctx: HttpContextContract) {
    return super.graphQLServerOptions({ ctx })
  }

  public installSubscriptionHandlers() {
      this.wsServer = new WebSocket.Server({ noServer: true })
      super.installSubscriptionHandlers(this.wsServer)
  }
}
