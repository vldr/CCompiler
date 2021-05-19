// @ts-ignore
import { parse } from "../parser/parser.js";

export default class Parser
{
    public parse(content: string): any
    {
        return parse(content);
    }
}