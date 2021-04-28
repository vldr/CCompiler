import Errors from "./Errors";

export default abstract class Expression
{
    static generate(expression: any): Expression
    {
        switch (expression.type)
        {
            // case "":
            //     break;
            default:
                throw Errors.UNIMPLEMENTED_EXPRESSION_TYPE(expression.type);
        }
    }
}