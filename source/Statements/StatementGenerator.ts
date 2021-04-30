import Compiler from "../Compiler";
import Scope from "../Scope";
import Statement from "./Statement";
import StatementDeclarator from "./StatementDeclarator";
import Errors from "../Errors";

export default class StatementGenerator
{
    constructor(private _compiler: Compiler, private _scope: Scope)
    {
    }

    public generate(node: any): Statement | undefined
    {
        switch (node.type) {
            case "declarator":
                return new StatementDeclarator(node, this._compiler, this._scope);
            default:
                return undefined;
                //throw Errors.UNIMPLEMENTED_STATEMENT_TYPE(statement.type);
        }
    }
}