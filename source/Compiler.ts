import Parser from "./Parser";
import Instruction from "./Instructions/Instruction";
import Logger from "./Logger";

export default class Compiler
{
    private _logger: Logger;
    private _root: Array<Instruction>;
    private _functions: Array<Instruction>;
    private _variables: Array<Instruction>;

    private _parser: Parser;

    constructor()
    {
        this._logger = new Logger();
        this._parser = new Parser();
        this._root = new Array<Instruction>();
        this._functions = new Array<Instruction>();
        this._variables = new Array<Instruction>();
    }

    public compile(content: string): any
    {
        return this._logger.log(this._parser.parse(content));
    }

    public emitToRoot(instruction: Instruction)
    {
        this._root.push(instruction);
    }

    public emitToFunctions(instruction: Instruction)
    {
        this._functions.push(instruction);
    }

    public emitToVariables(instruction: Instruction)
    {
        this._variables.push(instruction);
    }
}