import Errors from "./Errors";
import Destination from "./Destinations/Destination";

export default abstract class Expression
{
    public make(expression: any, destination: Destination): Expression
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