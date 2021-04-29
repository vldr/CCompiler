import Errors from "./Errors";
import { Location } from "./Location"

export default abstract class Expression
{
    static generate(expression: any, destination: Location): Expression
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