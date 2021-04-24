declare module "@ioc:Apollo/Server" {
  import { IResolvers } from "graphql-tools";
  import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
  import {
    Config,
    ApolloServerBase,
    PlaygroundRenderPageOptions,
  } from "apollo-server-core";
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

  export interface AdonisConfig extends Config {
    resolvers?:
      | IResolvers<any, HttpContextContract>
      | Array<IResolvers<any, HttpContextContract>>;
  }

  const ApolloServer: typeof ApolloServerContract;
  export default ApolloServer;
}
