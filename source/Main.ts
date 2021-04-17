// @ts-ignore
import { parse } from "../parser/parser.js";

class Main
{
    static log(message: string): void
    {
        console.log(parse("int a = 12;\n"));
    }
}

Main.log("Hello World");