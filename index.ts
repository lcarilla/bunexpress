import { App } from "./core/App";
import { BloatRequest } from "./types/BloatRequest";
import { BloatResponse } from "./types/BloatResponse";
import { HttpMethod } from "./types/HttpMethod";
class DTO {
    lol: string | undefined
}
const app = new App()
app.register(HttpMethod.POST, "/lol/:id", (req: BloatRequest<DTO>, res: BloatResponse) => {
    res.body = `you lol number is ${req.body.lol}`
    res.status = 418
    res.send()
}, { parseBodyClass: DTO })
app.listen(3000)
