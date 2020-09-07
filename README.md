# Apollo Adonis
This is an apollo-integration for adonisjs. It's still a work in progress, so PR's a very welcome. 

## Installation
```sh
npm install apollo-adonis
```

## Getting started
Add a new file under `start/apollo.ts` with the following contents:
```ts
import ApolloServer from '@ioc:Apollo/Server'

export default new ApolloServer({
    typeDefs: gql`
        type Query {
            hello: String
        }
    `,
    resolvers: {
        Query: {
            hello: () => 'world'
        }
    }
})
```
Then, add the following lines to your `start/routes.ts` file:
```ts
import ApolloServer from './apollo'

ApolloServer.applyMiddleware(Route)

// If you want subscription support:
ApolloServer.installSubscriptionHandlers()
```

Your Graphql Endpoint will be at `/graphql` and a playground will be available at `/graphql/playground`.