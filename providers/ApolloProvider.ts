import { IocContract } from '@adonisjs/fold'
import ApolloServer from '../src/ApolloServer'
import { PubSub } from 'apollo-server'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready, when this file is loaded by the framework.
| Hence, the level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class GraphQlProvider {
  constructor (protected container: IocContract) {
  }

  public register () {
    // Register your own bindings
    this.container.bind('Apollo/Server', () => ApolloServer)
    this.container.singleton('Apollo/PubSub', () => new PubSub())
  }

  public async boot () {
    // All bindings are ready, feel free to use them
  }

  public async ready () {
    // App is ready
    // await GraphQl.installSubscriptionHandlers((await import('@ioc:Adonis/Core/Server')).default)
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
