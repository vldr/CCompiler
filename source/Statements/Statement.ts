import Compiler from "../Compiler";
import Scope from "../Scope";
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