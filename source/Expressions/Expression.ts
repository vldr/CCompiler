import Compiler from "../Compiler";
import Scope from "../Scope";
import ExpressionResult from "./ExpressionResult";
import Destination from "../Destinations/Destination";

export default abstract class Expression
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