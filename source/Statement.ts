import Errors from "./Errors";

export default abstract class Statement
{
    static generate(statement: any): Statement
    {
        switch (statement.type) {
            // case "":
            //     break;
            default:
                throw Errors.UNIMPLEMENTED_STATEMENT_TYPE(statement.type);

        }
    }
}