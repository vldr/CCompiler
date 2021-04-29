import Errors from "./Errors";
import Compiler from "./Compiler";

export default abstract class Statement
{
    constructor(private _compiler: Compiler)
    {
    }

    public generate(statement: any): Statement
    {
        switch (statement.type) {
            // case "":
            //     break;
            default:
                throw Errors.UNIMPLEMENTED_STATEMENT_TYPE(statement.type);

        }
    }
}