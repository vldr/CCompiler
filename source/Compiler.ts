import Parser from "./Parser";

export default class Compiler
{
    private _parser: Parser;

    constructor()
    {
        this._parser = new Parser();
    }

    public compile(content: string): any
    {
        return this._parser.parse(content);
    }
}