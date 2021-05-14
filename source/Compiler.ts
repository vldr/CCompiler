import Parser from "./Parser";
import Logger from "./Logger";
import Statement from "./Statements/Statement";
import Scope from "./Scope";
import StatementGenerator from "./Statements/StatementGenerator";
import ExpressionGenerator from "./Expressions/ExpressionGenerator";
import Destination from "./Destinations/Destination";
import ExpressionResult from "./Expressions/ExpressionResult";
import Expression from "./Expressions/Expression";
import Node from "./Nodes/Node";
import InternalErrors from "./Errors/InternalErrors";
import CompilerMessage from "./Errors/CompilerMessage";
import Symbol from "./Symbols/Symbol";

export default class Compiler
{
    private _logger: Logger = new Logger();
    private _parser: Parser = new Parser();
    private _warnings = new Array<CompilerMessage>();
    private _symbols = new Array<Symbol>();
    private _root: Array<string> = new Array<string>();
    private _functions: Array<string> = new Array<string>();
    private _variables: Array<string> = new Array<string>();

    private _statementStack = new Array<Statement>();
    private _expressionStack = new Array<Expression>();

    private _rootScope: Scope;
    private _scopes: Array<Scope>;

    private _statementGenerator: StatementGenerator;
    private _expressionGenerator: ExpressionGenerator;

    public compile(code: string): string
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

        this._scopes.forEach((scope) =>
        {
            scope.emit();
        })

        this._root.push("HALT\n");

        if (this._functions.length > 0)
            this._functions.push("\n");

        return this._root.concat(this._functions).concat(this._variables).join("");
    }

    public addSymbol(symbol: Symbol)
    {
        this._symbols.push(symbol);
    }

    public getSymbols(): Symbol[]
    {
        return this._symbols;
    }

    public addWarning(warningMessage: CompilerMessage)
    {
        this._warnings.push(warningMessage);
    }

    public getWarnings(): Array<CompilerMessage>
    {
        return this._warnings;
    }

    public addScope(scope: Scope)
    {
        this._scopes.push(scope);
    }

    public generateAndEmitStatement(scope: Scope, node: any): void
    {
        this._statementGenerator.generateAndEmit(scope, node);
    }

    public generateExpression(destination: Destination, scope: Scope, node: Node): ExpressionResult
    {
        return this._expressionGenerator.generate(destination, scope, node);
    }

    public log(message: any)
    {
        this._logger.log(message);
    }

    public checkStatementStack(classType: Function): boolean
    {
        for (let i = this._statementStack.length - 2; i >= 0; i--)
        {
            if (this._statementStack[i].constructor == classType.constructor)
            {
                return true;
            }
        }

        return false;
    }

    public checkExpressionStack(classType: Function): boolean
    {
        for (let i = this._expressionStack.length - 2; i >= 0; i--)
        {
            if (this._expressionStack[i].constructor == classType.constructor)
            {
                return true;
            }
        }

        return false;
    }

    public pushExpressionStack(expression: Expression)
    {
        this._expressionStack.push(expression);
    }

    public popExpressionStack()
    {
        this._expressionStack.pop();
    }

    public pushStatementStack(statement: Statement)
    {
        this._statementStack.push(statement);
    }

    public popStatementStack()
    {
        this._statementStack.pop();
    }

    public previousExpression(): Statement | undefined
    {
        return this._statementStack[this._statementStack.length - 2];
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