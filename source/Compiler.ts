import Parser from "./Parser";
import Instruction from "./Instructions/Instruction";

export default class Compiler
{
    private _root: Array<string>;
    private _functions: Array<string>;
    private _variables: Array<string>;

    private _parser: Parser;

    constructor()
    {
        this._parser = new Parser();
    }

    public compile(content: string): any
    {
        return this._parser.parse(content);
    }

    public emitToRoot(instruction: Instruction)
    {
        this._root.push(instruction.emit());
    }

}