export async function handleMediaTypeBody(req: Request): Promise<Object | null> {
    try {
        if (req.method == "GET") return ""
        const contentType = req.headers.get("Content-Type")
        console.log(contentType)
        if (!contentType) throw new Error()
        switch (contentType) {
            case "application/json": return await req.json()
            case "application/x-www-form-urlencoded": return Object.fromEntries(await req.formData())
        }
        if (contentType.startsWith("text")) return req.text()
        if (contentType.startsWith("multipart/form-data")) return Object.fromEntries(await req.formData())
        return null
    } catch (e) {
        return null
    }
}