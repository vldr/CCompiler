import Compiler from "../Compiler";
import Scope from "../Scope";
import Statement from "./Statement";
import StatementDeclarator from "./StatementDeclarator";
import ExternalErrors from "../Errors/ExternalErrors";

export default class StatementGenerator
{
    constructor(private _compiler: Compiler, private _scope: Scope)
    {
    }

    public generate(scope: Scope, node: any): Statement
    {
        switch (node.type) {
            case "declarator":
                return new StatementDeclarator(node, this._compiler, scope);
            default:
                throw ExternalErrors.UNIMPLEMENTED_STATEMENT_TYPE(node, node.type);
        }
    }
}