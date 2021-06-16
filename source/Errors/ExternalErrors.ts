import CompilerMessage from "./CompilerMessage";
import Node from "../Nodes/Node";

export default abstract class ExternalErrors
{
    private static generateError(messageId: string, message: string, node: Node)
    {
        console.trace();

        return new CompilerMessage(
            messageId,
            messageId + ": " + message,
            node.location
        );
    }

    static INTI_LIST_INDEX_OUT_OF_BOUNDS(node: Node, expect: number, got: number)
    {
        return this.generateError("C0001", `The array expects '${expect}' elements but found '${got}' elements.`, node);
    }

    static CANNOT_NO_STRUCT_ARRAY(node: Node)
    {
        return this.generateError("C0002", `A struct type nor array type cannot be used here.`, node);
    }

    static RETURN_EXPECTING_NON_VOID_VALUE(node: Node)
    {
        return this.generateError("C0003",`The return statement expects a non-void value.`, node);
    }

    static RETURN_MUST_BE_IN_FUNCTION(node: Node)
    {
        return this.generateError("C0004", `The return statement can only be used within a function.`, node);
    }

    static CANNOT_COPY_STRUCT(node: Node)
    {
        return this.generateError("C0005", `Cannot copy/assignment struct types nor array types.`, node);
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(node: Node, expressionType: string)
    {
        return this.generateError("C0006", `Unimplemented expression type, '${expressionType}'.`, node);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(node: Node, statementType: string)
    {
        return this.generateError("C0007", `Unimplemented statement type, '${statementType}'.`, node);
    }

    static UNSUPPORTED_RETURN_TYPE(node: Node, type: string)
    {
        return this.generateError("C0008", `The type '${type}' is not supported as a return type for functions.`, node);
    }

    static UNKNOWN_TYPE(node: Node, type: string)
    {
        return this.generateError("C0009", `Unknown type '${type}'.`, node);
    }

    static UNKNOWN_QUALIFIER(node: Node, qualifier: string)
    {
        return this.generateError("C0010", `Unknown qualifier '${qualifier}'.`, node);
    }

    static BREAK_CAN_ONLY_BE_USED_IN_LOOP(node: Node)
    {
        return this.generateError("C0011", `The break statement can only be used within a loop.`, node);
    }

    static CONTINUE_CAN_ONLY_BE_USED_IN_LOOP(node: Node)
    {
        return this.generateError("C0012", `The continue statement can only be used within a loop.`, node);
    }

    static VARIABLE_NAME_TAKEN(node: Node, variableName: string)
    {
        return this.generateError("C0013", `The name '${variableName}' is already used by either a struct declaration or another variable.`, node);
    }

    static FUNCTION_NAME_TAKEN(node: Node, functionName: string)
    {
        return this.generateError("C0014", `The name '${functionName}' is already used by another function.`, node);
    }

    static CANNOT_CONVERT_TYPE(node: Node, srcType: string, destType: string)
    {
        return this.generateError(
            "C0015", `The type '${srcType}' is not compatible with '${destType}'. (are you missing a cast?)`,
            node
        );
    }

    static ARRAY_TOO_SMALL(node: Node)
    {
        return this.generateError("C0016", `The size of an array cannot be zero or negative.`, node);
    }

    static ARRAY_SIZE_MUST_BE_CONSTANT(node: Node)
    {
        return this.generateError("C0017", `The size of an array must be a constant.`, node);
    }

    static TYPE_MUST_BE_STRUCT(node: Node)
    {
        return this.generateError("C0018", `The type must be a struct to be able to access fields from.`, node);
    }

    static CONST_VARIABLES_MUST_BE_INIT(node: Node)
    {
        return this.generateError("C0019", `Constant variables must be initialized.`, node);
    }

    static STRUCT_MUST_BE_NAMED(node: Node)
    {
        return this.generateError("C0020", `Structs must be named.`, node);
    }

    static CANNOT_FIND_NAME(node: Node, name: string)
    {
        return this.generateError("C0021", `Cannot find name '${name}'.`, node);
    }

    static NOT_SUPPORTED_OPERATOR(node: Node, operator: string)
    {
        return this.generateError("C0022", `The operator '${operator}' is not supported by the backend.`, node);
    }

    static OPERATOR_EXPECTS_VARIABLE(node: Node, operator: string)
    {
        return this.generateError("C0023", `The operator '${operator}' can only be used on lvalues.`, node);
    }

    static MUST_BE_ARRAY_TYPE(node: Node, typeName: string)
    {
        return this.generateError("C0024", `The type '${typeName}' must be an array.`, node);
    }

    static MUST_NOT_BE_ARRAY_TYPE(node: Node, typeName: string)
    {
        return this.generateError("C0025", `The type '${typeName}' must not be an array.`, node);
    }

    static CANNOT_MODIFY_VARIABLE_READONLY(node: Node, variableName: string)
    {
        return this.generateError("C0026", `The variable '${variableName}' cannot be modified, it is read-only.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(node: Node, operator: string, typeName: string)
    {
        return this.generateError("C0027", `The operator '${operator}' is not supported for '${typeName}'.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node: Node, operator: string, typeName: string)
    {
        return this.generateError("C0028", `The unary operator '${operator}' is not supported for '${typeName}'.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_TYPE_CAST(node: Node, typeName: string, dstTypeName: string)
    {
        return this.generateError("C0029", `The type '${typeName}' cannot be casted to '${dstTypeName}'.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_PUSH(node: Node, typeName: string)
    {
        return this.generateError("C0030", `The push intrinsic cannot accept type '${typeName}' as a parameter.`, node);
    }

    static UNSUPPORTED_TYPE_FOR_LOAD(node: Node, typeName: string)
    {
        return this.generateError("C0031", `The load intrinsic cannot accept type '${typeName}' as a parameter.`, node);
    }

    static FUNCTION_RETURN_VOID(node: Node)
    {
        return this.generateError("C0032", `The cannot return a value because it is void-type.`, node);
    }

    static PARAMETER_MISSING(node: Node, functionName: string, expecting: number, got: number)
    {
        return this.generateError("C0033", `The function '${functionName}' expects ${expecting} parameters but instead of ${got}.`, node);
    }

    static CANNOT_DECLARE_VAR_HERE(node: Node)
    {
        return this.generateError("C0034", `A variable cannot be declared here.`, node);
    }

    static ARRAY_MUST_BE_ATLEAST_ONE(node: Node)
    {
        return this.generateError("C0035", `An array's size must be at least one.`, node);
    }

    static FUNCTION_NAME_UNDERSCORE(node: Node)
    {
        return this.generateError("C0036", `A function's name cannot begin with an underscore.`, node);
    }

    static OUT_OF_BOUNDS_UINT(node: Node)
    {
        return this.generateError("C0037", `The unsigned integer is out of bounds, that is, the value must be between 0 and 4294967295.`, node);
    }

    static OUT_OF_BOUNDS_INT(node: Node)
    {
        return this.generateError("C0038", `The signed integer is out of bounds, that is, the value must be between -2147483648 and 2147483647.`, node);
    }

    static ARRAY_SIZE_MUST_BE_INT_OR_UINT(node: Node)
    {
        return this.generateError("C0039", `The size of an array must be an integer or unsigned integer.`, node);
    }
}