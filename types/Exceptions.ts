import { HttpStatus } from "./HttpStatus";

export class BloatException extends Error {
    status: HttpStatus
    constructor(status: HttpStatus, message: string) {
        super(message)
        this.status = status
    }
}
export class EndpointNotFoundException extends BloatException {
    constructor() {
        super(HttpStatus.NOT_FOUND, "endpoint not found")
    }
}