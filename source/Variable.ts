import Scope from "./Scope";
import Type from "./Type";

export default class Variable
{
    private _scope: Scope;
    private _name: string;
    private _labelName: string;
    private _type: Type;

    constructor(name: string, type: Type, scope: Scope)
    {
        this._name = name;
        this._scope = scope;
        this._type = type;
        this._labelName = `${scope.name}_${this._name}`;
    }

    get scope() { return this._scope };
    get name() { return this._name };
    get type() { return this._type };
    get labelName() { return this._labelName };
}