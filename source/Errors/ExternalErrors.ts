import CompilerError from "./CompilerError";
import Node from "../Nodes/Node";

export default abstract class ExternalErrors
{
    private static generateError(message: string, node: Node)
    {
        return new CompilerError(
            message,
            node.location
        );
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(node: Node, expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`, node);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(node: Node, statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`, node);
    }

    static UNKNOWN_TYPE(node: Node, type: string)
    {
        return this.generateError(`Unknown type '${type}'.`, node);
    }

    static UNKNOWN_QUALIFIER(node: Node, qualifier: string)
    {
        return this.generateError(`Unknown qualifier '${qualifier}'.`, node);
    }

    static VARIABLE_NAME_TAKEN(node: Node, variableName: string)
    {
        return this.generateError(`The name '${variableName}' is already used by either a struct declaration or another variable.`, node);
    }

    static CANNOT_CONVERT_TYPE(node: Node, srcType: string, destType: string)
    {
        return this.generateError(
            `The type '${srcType}' is not compatible with '${destType}'. (are you missing a cast?)`,
            node
        );
    }

    static ARRAY_TOO_SMALL(node: Node)
    {
        return this.generateError(`The size of an array cannot be zero or negative.`, node);
    }

    static CONST_VARIABLES_MUST_BE_INIT(node: Node)
    {
        return this.generateError(`Constant variables must be initialized.`, node);
    }
}