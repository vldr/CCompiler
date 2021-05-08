import CompilerError from "./CompilerError";
import Node from "../Nodes/Node";
import type = Mocha.utils.type;

export default abstract class ExternalErrors
{
    private static generateError(message: string, node: Node)
    {
        return new CompilerError(
            message,
            node.location
        );
    }

    static CANNOT_NO_STRUCT_ARRAY(node: Node)
    {
        return this.generateError(`A struct type nor array type cannot be used here.`, node);
    }

    static RETURN_EXPECTING_NON_VOID_VALUE(node: Node)
    {
        return this.generateError(`The return statement expects a non-void value.`, node);
    }

    static RETURN_MUST_BE_IN_FUNCTION(node: Node)
    {
        return this.generateError(`The return statement can only be used within a function.`, node);
    }

    static CANNOT_COPY_STRUCT(node: Node)
    {
        return this.generateError(`Cannot copy/assignment struct types nor array types.`, node);
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(node: Node, expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`, node);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(node: Node, statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`, node);
    }

    static UNSUPPORTED_RETURN_TYPE(node: Node, type: string)
    {
        return this.generateError(`The type '${type}' is not supported as a return type for functions.`, node);
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

    static FUNCTION_NAME_TAKEN(node: Node, functionName: string)
    {
        return this.generateError(`The name '${functionName}' is already used by another function.`, node);
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

    static TYPE_MUST_BE_STRUCT(node: Node)
    {
        return this.generateError(`The type must be a struct to be able to access fields from.`, node);
    }

    static CONST_VARIABLES_MUST_BE_INIT(node: Node)
    {
        return this.generateError(`Constant variables must be initialized.`, node);
    }

    static STRUCT_MUST_BE_NAMED(node: Node)
    {
        return this.generateError(`Structs must be named.`, node);
    }

    static CANNOT_FIND_NAME(node: Node, name: string)
    {
        return this.generateError(`Cannot find name '${name}'.`, node);
    }

    static NOT_SUPPORTED_OPERATOR(node: Node, operator: string)
    {
        return this.generateError(`The operator '${operator}' is not supported by the backend.`, node);
    }

    static OPERATOR_EXPECTS_VARIABLE(node: Node, operator: string)
    {
        return this.generateError(`The operator '${operator}' can only be used on lvalues.`, node);
    }

    static MUST_BE_ARRAY_TYPE(node: Node, typeName: string)
    {
        return this.generateError(`The type '${typeName}' must be an array.`, node);
    }

    static MUST_NOT_BE_ARRAY_TYPE(node: Node, typeName: string)
    {
        return this.generateError(`The type '${typeName}' must not be an array.`, node);
    }

    static CANNOT_MODIFY_VARIABLE_READONLY(node: Node, variableName: string)
    {
        return this.generateError(`The variable '${variableName}' cannot be modified, it is read-only.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node: Node, operator: string, typeName: string)
    {
        return this.generateError(`The unary operator '${operator}' is not supported for '${typeName}'.`, node);
    }
}