import Compiler from "../Compiler";
import Scope from "../Scope";
import Statement from "./Statement";
import StatementDeclarator from "./StatementDeclarator";
import ExternalErrors from "../Errors/ExternalErrors";
import StatementStructDefinition from "./StatementStructDefinition";
import StatementFunctionDeclaration from "./StatementFunctionDeclaration";
import StatementReturn from "./StatementReturn";
import StatementExpression from "./StatementExpression";

export default class StatementGenerator
{
    constructor(private _compiler: Compiler, private _scope: Scope)
    {
    }

    public generateAndEmit(scope: Scope, node: any): void
    {
        let statement: Statement;

        switch (node.type)
        {
            case "declarator":
                statement = new StatementDeclarator(node, this._compiler, scope);
                break;
            case "struct_definition":
                statement = new StatementStructDefinition(node, this._compiler, scope);
                break;
            case "function_declaration":
                statement = new StatementFunctionDeclaration(node, this._compiler, scope);
                break;
            case "return":
                statement = new StatementReturn(node, this._compiler, scope);
                break;
            case "expression":
                statement = new StatementExpression(node, this._compiler, scope);
                break;
            default:
                throw ExternalErrors.UNIMPLEMENTED_STATEMENT_TYPE(node, node.type);
        }

        this._compiler.pushStatementStack(statement);
        statement.generateAndEmit();
        this._compiler.popStatementStack();
    }
}