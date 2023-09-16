import { BloatRequest } from "../types/BloatRequest";
import { BloatResponse } from "../types/BloatResponse";
import { BloatException, EndpointNotFoundException } from "../types/Exceptions";
import { HttpMethod, mapToHttpMethod } from "../types/HttpMethod";
import { HttpStatus } from "../types/HttpStatus";
import { handleMediaTypeBody } from "../types/MediaType";
import { validate } from "./Validation";

export class App {
    public endpoints: MethodEndpoints = {}
    register(method: HttpMethod, path: string, handler: Handler, options: EndpointOptions) {
        if (!this.endpoints[method]) {
            this.endpoints[method] = {}
        }
        this.endpoints[method][path] = [handler, options];
    }
    listen(port: number) {
        const self = this
        Bun.serve({
            port: port,
            async fetch(request: Request) {
                try {
                    const path = getPath(request.url)
                    const method: HttpMethod = mapToHttpMethod(request.method)
                    const { v: handler, obj: params } = self.getHandlerAndParams(method, path);
                    console.log(params)
                    let bloatBody = await handleMediaTypeBody(request)
                    if (!bloatBody)
                        throw new BloatException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "unsopported media type")
                    if (handler[1].parseBodyClass)
                        bloatBody = validate(handler[1].parseBodyClass, bloatBody)
                    const bloatRequest: BloatRequest<any> = new BloatRequest(
                        method, request.url, path, params, request.headers, bloatBody
                    )
                    const bloatResponse = new BloatResponse(new Headers())
                    handler[0](bloatRequest, bloatResponse);
                    if (bloatResponse.ready) {
                        return new Response(bloatResponse.body, { status: bloatResponse.status, headers: bloatResponse.headers })
                    }
                    return new Response(JSON.stringify(bloatRequest.body))
                } catch (e) {
                    if (e instanceof BloatException) {
                        return new Response(
                            JSON.stringify({ message: e.message }), { status: e.status }
                        )
                    }
                    console.log(e)
                    console.error("You might be using custom exceptions that do not extend the BloatException")
                    return new Response(JSON.stringify({ message: "internal server error" }), { status: 500 })
                }
            },
        });
    }
    getHandlerAndParams(method: HttpMethod, path: string) {
        const values = path.substring(1).split("/")
        for (const [k, v] of Object.entries(this.endpoints[method])) {
            const tokens = k.substring(1).split("/")
            if (tokens.length != values.length) continue
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].startsWith(":")) continue
                if (tokens[i] != values[i]) break
            }
            const obj: { [key: string]: string } = {}
            tokens.forEach((t: string, i: number) => {
                if (t.includes(":")) obj[t.substring(1)] = values[i]
            })
            return { v, obj };
        }
        throw new EndpointNotFoundException()
    }
}
interface Endpoints {
    [key: string]: [Handler, EndpointOptions];
}
type Handler = (req: BloatRequest<any>, res: BloatResponse) => Promise<void> | void;
interface MethodEndpoints {
    [key: number]: Endpoints;
}
interface EndpointOptions {
    parseBodyClass?: any
}
function getPath(url: string) {
    const pathRegex = /^https?:\/\/[^/]+(\/[^?#]*)?/;
    const matches = url.match(pathRegex);
    if (matches && matches[1]) {
        return matches[1]
    }
    return "/"
}
