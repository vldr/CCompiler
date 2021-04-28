import Variable from "./Variable";
import Type from "./Type";
import Scope from "./Scope";

export default class Function
{
    private _scope: Scope;
    private _name: string;
    private _labelName: string;

    private _parameters: Array<Variable>;
    private _returnType: Type;

    constructor(name: string, parameters: Array<Variable>, returnType: Type, scope: Scope)
    {
        this._name = name;
        this._parameters = parameters;
        this._returnType = returnType;
        this._scope = scope;
    }

    get scope(): Scope { return this._scope; }
    get labelName(): string { return this._labelName; }
    get returnType(): Type { return this._returnType; }
    get parameters(): Array<Variable> { return this._parameters; }
    get name(): string { return this._name; }
}