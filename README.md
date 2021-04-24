# Apollo Adonis (Adonis 5)
[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

This is an Apollo Server integration for Adonisjs 5. It's still a work in progress, so PR's are very welcome.

## Quickstart

```sh
npm install graphql apollo graphql-tag apollo-adonis
node ace invoke apollo-adonis
```

You can leave out `graphql-tag` if you don't need it. The second command adds a file at `start/apollo.ts` which contains an Apollo Server instance. Then, add the following lines to your `start/routes.ts` file:

```ts
// start/routes.ts

import ApolloServer from "./apollo";

ApolloServer.routes();
```

Your Graphql Endpoint will be at `/graphql`.

## Route Options

You can pass a config object to `ApolloServer.routes({ ... })`
Available options are:

| name          | type                    | description                                                                                       |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| path          | `string`                | The path on which the graphql endpoint will be registered at.                                     |
| playground    | `boolean`               | Will provide a GraphQL Playground at `{path}/playground`.                                         |
| subscriptions | `boolean`               | If it set to `true`, Apollo Server subscription handlers will be installed on a websocket server. |
| Route         | Adonis `RouterContract` | You can pass a custom router, on which the routes will get registered.                            |

### Example

This will set up a graphql endpoint at `/someurl/graph` with a playground at `/someurl/graph/playground` and a subscriptions endpoint at `/someurl/graph`.

```ts
ApolloServer.routes({
  path: "/someurl/graph",
  subscriptions: true,
  playground: true,
});
```

## Subscriptions Setup

You can setup subscriptions using the `routes` methods option, or you can manually call `ApolloServer.installSubscriptionHandlers()` in your `start/routes.ts` file:

```ts
// start/routes.ts

ApolloServer.routes({ subscriptions: true });
// or
ApolloServer.installSubscriptionHandlers();
```

### PubSub

This Package provides a default PubSub instance at `Apollo/PubSub`. You can import it using:

```ts
import PubSub from "@ioc:Apollo/PubSub";

// ...
```

## Manual Route Registration

The `routes` method registers routes which are then calling the `handle` and `renderPlayground` methods. You can manually call these methods if you need more control:

```ts
// start/routes.ts
import ApolloServer from "./apollo";

Route.route("/graphql", ['GET', 'POST'] (ctx) => ApolloServer.handle(ctx));
Route.get("/graphql/playground", (ctx) => ApolloServer.renderPlayground({ endpoint: '/graphql' }));

// If you want to use subscriptions in a manual setup
ApolloServer.installSubscriptionHandlers()
```

[npm-image]: https://img.shields.io/npm/v/apollo-adonis.svg
[npm-url]: https://www.npmjs.com/package/apollo-adonis
[ci-image]: https://github.com/sebastiandittrich/apollo-adonis/workflows/NPM%20Publish/badge.svg
[ci-url]: https://github.com/sebastiandittrich/apollo-adonis/actions?query=workflow%3A%22NPM+Publish%22
[download-image]: https://img.shields.io/npm/dm/apollo-adonis.svg
[download-url]: https://www.npmjs.com/package/apollo-adonis
