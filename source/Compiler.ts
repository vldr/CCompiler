import Parser from "./Parser";
import Instruction from "./Instructions/Instruction";
import Logger from "./Logger";
import Statement from "./Statements/Statement";
import Scope from "./Scope";
import StatementGenerator from "./Statements/StatementGenerator";
import ExpressionGenerator from "./Expressions/ExpressionGenerator";
import Expression from "./Expressions/Expression";
import Destination from "./Destinations/Destination";

export default class Compiler
{
    private _logger: Logger = new Logger();
    private _parser: Parser = new Parser();
    private _root: Array<Instruction> = new Array<Instruction>();
    private _functions: Array<Instruction> = new Array<Instruction>();
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
            this.generateStatement(node)?.generate();
        })

        const compiledOutput = (this._root.concat(this._functions)).map(s => s.emit()).concat(this._variables);

        console.log(compiledOutput);
    }

    public addScope(scope: Scope)
    {
        this._scopes.push(scope);
    }

    public generateStatement(node: any): Statement | undefined
    {
        return this._statementGenerator.generate(node);
    }

    public generateExpression(destination: Destination, node: any): Expression
    {
        return this._expressionGenerator.generate(destination, node);
    }

    public log(message: any)
    {
        this._logger.log(message);
    }

    public emitToRoot(instruction: Instruction)
    {
        this._root.push(instruction);
    }

    public emitToFunctions(instruction: Instruction)
    {
        this._functions.push(instruction);
    }

    public emitToVariables(value: string)
    {
        this._variables.push(value);
    }
}