import Parser from "./Parser";
import Logger from "./Logger";
import Statement from "./Statements/Statement";
import Scope from "./Scope";
import StatementGenerator from "./Statements/StatementGenerator";
import ExpressionGenerator from "./Expressions/ExpressionGenerator";
import Destination from "./Destinations/Destination";
import ExpressionResult from "./Expressions/ExpressionResult";

export default class Compiler
{
    private _logger: Logger = new Logger();
    private _parser: Parser = new Parser();
    private _root: Array<string> = new Array<string>();
    private _functions: Array<string> = new Array<string>();
    private _variables: Array<string> = new Array<string>();

    private _rootScope: Scope;
    private _scopes: Array<Scope>;

    private _statementGenerator: StatementGenerator;
    private _expressionGenerator: ExpressionGenerator;

    public compile(code: string): any
    {
        const parsedCode = this._parser.parse(code);

        this._rootScope = new Scope(this);

        this._statementGenerator = new StatementGenerator(this, this._rootScope);
        this._expressionGenerator = new ExpressionGenerator(this, this._rootScope);

        this._scopes = [ this._rootScope ];

        parsedCode.statements.forEach((node: any) =>
        {
            this.generateAndEmitStatement(this._rootScope, node);
        })

        const compiledOutput = this._root.concat(this._functions).concat(this._variables);

        console.log(compiledOutput);
    }

    public addScope(scope: Scope)
    {
        this._scopes.push(scope);
    }

    public generateAndEmitStatement(scope: Scope, node: any): void
    {
        this._statementGenerator.generateAndEmit(scope, node);
    }

    public generateExpression(destination: Destination, scope: Scope, node: any): ExpressionResult
    {
        return this._expressionGenerator.generate(destination, scope, node);
    }

    public log(message: any)
    {
        this._logger.log(message);
    }

    public emitToRoot(value: string)
    {
        this._root.push(value);
    }

    public emitToFunctions(value: string)
    {
        this._functions.push(value);
    }

    public emitToVariables(value: string)
    {
        this._variables.push(value);
    }
}