import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import ApolloServer from "../src/ApolloServer";
import { PubSub } from "apollo-server";

export default class GraphQlProvider {
  static needsApplication = true;
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.bind("Apollo/Server", () => ApolloServer);
    this.app.container.singleton("Apollo/PubSub", () => new PubSub());
  }

  public boot() {
    ApolloServer.defaultRoute = this.app.container.use("Adonis/Core/Route");
  }
}
