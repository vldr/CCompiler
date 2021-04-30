import Compiler from "../Compiler";
import Scope from "../Scope";
import Errors from "../Errors";
import Expression from "./Expression";
import Destination from "../Destinations/Destination";

export default class ExpressionGenerator
{
    constructor(private _compiler: Compiler, private _scope: Scope)
    {
    }

    public generate(destination: Destination, node: any): Expression
    {
        switch (node.type) {
            default:
                throw Errors.UNIMPLEMENTED_EXPRESSION_TYPE(node.type);
        }
    }
}