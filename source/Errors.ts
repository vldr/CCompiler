export default abstract class Errors
{
    private static generateError(message: string)
    {
        return new Error(message);
    }

    static UNIMPLEMENTED_EMITTER()
    {
        return this.generateError(`Unimplemented emitter.`);
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`);
    }

    static UNSUPPORTED_VALUE_TYPE(valueType: Function)
    {
        return this.generateError(`Unsupported value type, '${valueType}'.`);
    }

    static UNKNOWN_TYPE(type: string)
    {
        return this.generateError(`Unknown type '${type}'.`);
    }

    static UNKNOWN_QUALIFIER(qualifier: string)
    {
        return this.generateError(`Unknown qualifier '${qualifier}'.`);
    }
}