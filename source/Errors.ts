export default abstract class Errors
{
    private static generateError(message: string)
    {
        return new Error(message);
    }

    static UNIMPLEMENTED_EXPRESSION_TYPE(expressionType: string)
    {
        return this.generateError(`Unimplemented expression type, '${expressionType}'.`);
    }

    static UNIMPLEMENTED_STATEMENT_TYPE(statementType: string)
    {
        return this.generateError(`Unimplemented statement type, '${statementType}'.`);
    }
}