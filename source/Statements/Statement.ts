import Errors from "../Errors";
import Compiler from "../Compiler";
import StatementDeclarator from "./StatementDeclarator";
import Instruction from "../Instructions/Instruction";
import Scope from "../Scope";
import Destination from "../Destinations/Destination";
import Emittable from "../Emittable";

export default abstract class Statement implements Emittable
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