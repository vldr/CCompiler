import Compiler from "../Compiler";
import Scope from "../Scope";
import ExpressionResult from "./ExpressionResult";
import Destination from "../Destinations/Destination";
import Emittable from "../Emittable";

export default abstract class Expression implements Emittable
{
    constructor(
        protected _node: any,
        protected _destination: Destination,
        protected _compiler: Compiler,
        protected _scope: Scope
    )
    {
    }

    public abstract generate(destination: Destination): ExpressionResult;
    public abstract emit(): void;
}