import Compiler from "../Compiler";
import Scope from "../Scope";
import ExpressionResult from "./ExpressionResult";
import Destination from "../Destinations/Destination";
import Node from "../Nodes/Node";

export default abstract class Expression
{
    constructor(
        protected _node: Node,
        protected _destination: Destination,
        protected _compiler: Compiler,
        protected _scope: Scope
    )
    {
    }

    public abstract generate(): ExpressionResult;
}