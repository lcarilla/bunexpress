import { HttpStatus } from "./HttpStatus"

export class BloatResponse {
    constructor(public headers: Headers) { }
    body = ""
    status = HttpStatus.OK
    send() { this.ready = true }
    ready = false
}