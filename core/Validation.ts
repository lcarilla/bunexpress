import { BloatException } from "../types/Exceptions";
import { HttpStatus } from "../types/HttpStatus";

interface Class extends Function { new(...args: any[]): any; }
export function validate(clazz: Class, obj: any) {
    console.log(obj)
    const clazzInstance = new clazz();
    const names = Object.getOwnPropertyNames(clazzInstance)
    names.forEach(n => {
        if (!obj[n]) throw new BloatException(HttpStatus.BAD_REQUEST, "validation failed")
        clazzInstance[n] = obj[n]
    })
    return clazzInstance;
}