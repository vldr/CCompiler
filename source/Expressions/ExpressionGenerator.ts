import Compiler from "../Compiler";
import Scope from "../Scope";
import ExternalErrors from "../Errors/ExternalErrors";
import Expression from "./Expression";
import ExpressionConstant from "./ExpressionConstant";
import Destination from "../Destinations/Destination";
import ExpressionResult from "./ExpressionResult";
import ExpressionBinary from "./ExpressionBinary";
import ExpressionIdentifier from "./ExpressionIdentifier";
import ExpressionUnary from "./ExpressionUnary";
import ExpressionPostfix from "./ExpressionPostfix";
import Node from "../Nodes/Node";
import ExpressionFunctionCall from "./ExpressionFunctionCall";
import ExpressionTypeCast from "./ExpressionTypeCast";
import ExpressionTernary from "./ExpressionTernary";

export default class ExpressionGenerator
{
    constructor(
        private _compiler: Compiler,
        private _scope: Scope
    )
    {
    }

    public generate(destination: Destination, scope: Scope, node: Node): ExpressionResult
    {
        let expression: Expression;

        switch (node.type) {
            case "int":
            case "uint":
            case "float":
                expression = new ExpressionConstant(node, destination, this._compiler, scope);
                break;
            case "binary":
                expression = new ExpressionBinary(node, destination, this._compiler, scope);
                break;
            case "identifier":
                expression = new ExpressionIdentifier(node, destination, this._compiler, scope);
                break;
            case "unary":
                expression = new ExpressionUnary(node, destination, this._compiler, scope);
                break;
            case "postfix":
                expression = new ExpressionPostfix(node, destination, this._compiler, scope);
                break;
            case "function_call":
                expression = new ExpressionFunctionCall(node, destination, this._compiler, scope);
                break;
            case "type_cast":
                expression = new ExpressionTypeCast(node, destination, this._compiler, scope);
                break;
            case "ternary":
                expression = new ExpressionTernary(node, destination, this._compiler, scope);
                break;
            default:
                throw ExternalErrors.UNIMPLEMENTED_EXPRESSION_TYPE(node, node.type);
        }

        this._compiler.pushExpressionStack(expression);
        const expressionResult = expression.generate();
        this._compiler.popExpressionStack();

        return expressionResult;
    }
}