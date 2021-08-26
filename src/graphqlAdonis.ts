
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { runHttpQuery, GraphQLOptions} from 'apollo-server-core'
import { Headers, Request } from 'apollo-server-env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpQueryError } from "apollo-server-core"

export function convertAdonisRequestToApolloRequest(req: RequestContract): Request {
    const headers = new Headers();
    Object.keys(req.headers()).forEach(key => {
        const values = req.headers()[key]!;
        if (Array.isArray(values)) {
            values.forEach(value => headers.append(key, value));
        } else {
            headers.append(key, values);
        }
    });

    return new Request(req.url(), {
        headers,
        method: req.method(),
    });
}

export async function graphqlAdonis(ctx: HttpContextContract, options: GraphQLOptions) {
    return await runHttpQuery([ctx.request, ctx.response], {
        method: ctx.request.method(),
        options: {
            ...options,
            context: ctx
        },
        query: ctx.request.method() === 'POST' ? ctx.request.body() : ctx.request.get(),
        request: convertAdonisRequestToApolloRequest(ctx.request)
    }).then(({ graphqlResponse, responseInit }) => {
        if(responseInit.headers) {
            for (const [name, value] of Object.entries(responseInit.headers)) {
                ctx.response.header(name, value)
            }
        }

        return graphqlResponse;
    }, (error: HttpQueryError) => {
        console.log(error)
        if ('HttpQueryError' !== error.name) {
            throw error
        }

        if (error.headers) {
            for (const [name, value] of Object.entries(error.headers)) {
                ctx.response.header(name, value)
            }
        }

        ctx.response.status(error.statusCode)
        return error.message
    })
}
