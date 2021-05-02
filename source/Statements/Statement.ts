import Compiler from "../Compiler";
import Scope from "../Scope";

export default abstract class Statement
{
    constructor(
        protected _node: any,
        protected _compiler: Compiler,
        protected _scope: Scope
    )
    {
    }

    public abstract generateAndEmit(): void;
}