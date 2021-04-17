// @ts-ignore
import { parse } from "../parser/parser.js";
import Logger from "./Logger"

class Main
{
    static start(): void
    {
        Logger.log(parse("int a = 12;\n"));
    }
}

Main.start();