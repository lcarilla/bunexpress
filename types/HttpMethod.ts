export enum HttpMethod {
    GET, POST, PUT, DELETE, UNKNOWN
}
export function mapToHttpMethod(s: string) {
    switch (s) {
        case "GET": return HttpMethod.GET
        case "POST": return HttpMethod.POST
        default: return HttpMethod.UNKNOWN
    }
}