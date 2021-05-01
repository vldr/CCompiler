import CompilerError from "./CompilerError";
import ErrorLocation from "./ErrorLocation";

export default abstract class ExternalErrors
{
    private static generateError(message: string, node: any)
    {
        return new CompilerError(
            message,
            new ErrorLocation(node.location.start.offset, node.location.start.line, node.location.start.column),
            new ErrorLocation(node.location.end.offset, node.location.end.line, node.location.end.column)
        );
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(node: any, expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`, node);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(node: any, statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`, node);
    }

    static UNKNOWN_TYPE(node: any, type: string)
    {
        return this.generateError(`Unknown type '${type}'.`, node);
    }

    static UNKNOWN_QUALIFIER(node: any, qualifier: string)
    {
        return this.generateError(`Unknown qualifier '${qualifier}'.`, node);
    }

    static VARIABLE_NAME_TAKEN(variableName: any, node: any)
    {
        return this.generateError(`The name '${variableName}' is already used by either a struct declaration or another variable.`, node);
    }

    static CANNOT_CONVERT_TYPE(srcType: any, destType: any, node: any)
    {
        return this.generateError(
            `The type '${srcType}' is not compatible with '${destType}'. (are you missing a cast?)`,
            node
        );
    }

    static ARRAY_TOO_SMALL(node: any)
    {
        return this.generateError(`The size of an array cannot be zero or negative.`, node);
    }

    static CONST_VARIABLES_MUST_BE_INIT(node: any)
    {
        return this.generateError(`Constant variables must be initialized.`, node);
    }
}