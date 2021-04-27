import Scope from "./Scope";

export default class Variable
{
    private _scope: Scope;
    private _name: string;
    private _labelName: string;

    constructor(name: string, scope: Scope)
    {
        this._name = name;
        this._scope = scope;
        this._labelName = `${scope.name}_${this._name}`;
    }

    get scope() { return this._scope };
    get name() { return this._name };
    get labelName() { return this._labelName };
}