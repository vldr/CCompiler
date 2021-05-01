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

    static UNIMPLEMENTED_EMITTER(node: any)
    {
        return this.generateError(`Unimplemented emitter.`, node);
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(node: any, expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`, node);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(node: any, statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`, node);
    }

    static UNSUPPORTED_VALUE_TYPE(node: any, valueType: Function)
    {
        return this.generateError(`Unsupported value type, '${valueType}'.`, node);
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

    static ARRAY_TOO_SMALL(node: any)
    {
        return this.generateError(`The size of an array cannot be zero or negative.`, node);
    }

    static CONST_VARIABLES_MUST_BE_INIT(node: any)
    {
        return this.generateError(`Constant variables must be initialized.`, node);
    }
}