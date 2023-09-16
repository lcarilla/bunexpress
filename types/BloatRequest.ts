import { HttpMethod } from "./HttpMethod"
export class BloatRequest<T> {
    constructor(
        public method: HttpMethod,
        public url: string,
        public path: string,
        public params: BloatRequestParams,
        public headers: Headers,
        public body: T
    ) { }
}

export type BloatRequestParams = { [key: string]: string }