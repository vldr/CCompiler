import Scope from "./Scope";
import Type from "./Types/Type";
import Variable from "./Variables/Variable";

export default class Function
{
    private _labelName: string;

    constructor(
        private _name: string,
        private _parameters: Array<Variable>,
        private _returnType: Type,
        private _scope: Scope
    )
    {
        this._labelName = `${_scope.name.length > 0 ? _scope.name + "_" : ""}fn_${this._name}`;
    }

    get scope(): Scope { return this._scope; }
    get labelName(): string { return this._labelName; }
    get returnType(): Type { return this._returnType; }
    get parameters(): Array<Variable> { return this._parameters; }
    get name(): string { return this._name; }
}