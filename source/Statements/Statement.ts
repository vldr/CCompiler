import Errors from "../Errors";
import Compiler from "../Compiler";
import StatementDeclarator from "./StatementDeclarator";
import Instruction from "../Instructions/Instruction";
import Scope from "../Scope";
import Destination from "../Destinations/Destination";

export default abstract class Statement
{
    constructor(
        protected _node: any,
        protected _compiler: Compiler,
        protected _scope: Scope
    )
    {
    }

    public abstract generate(): void;
    public abstract emit(): void;
}