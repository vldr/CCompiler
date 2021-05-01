import Compiler from "../Compiler";
import Scope from "../Scope";
import ExternalErrors from "../Errors/ExternalErrors";
import Expression from "./Expression";
import ExpressionConstant from "./ExpressionConstant";
import Destination from "../Destinations/Destination";
import ExpressionResult from "./ExpressionResult";

export default class ExpressionGenerator
{
    constructor(
        private _compiler: Compiler,
        private _scope: Scope
    )
    {
    }

    public generate(destination: Destination, scope: Scope, node: any): ExpressionResult
    {
        switch (node.type) {
            case "int":
            case "uint":
            case "float":
                return new ExpressionConstant(node, destination, this._compiler, scope).generate();
            default:
                throw ExternalErrors.UNIMPLEMENTED_EXPRESSION_TYPE(node, node.type);
        }
    }
}