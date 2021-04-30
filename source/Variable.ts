import Scope from "./Scope";
import Type from "./Types/Type";
import Qualifier from "./Qualifiers/Qualifier";
import QualifierConst from "./Qualifiers/QualifierConst";

export default class Variable
{
    private _labelName: string;

    constructor(
        private _name: string,
        private _type: Type,
        private _scope: Scope,
        private _qualifier: Qualifier,
        private _size: number
    )
    {
        this._labelName = `${_scope.name}_${this._name}`;
    }

    get scope() { return this._scope };
    get name() { return this._name };
    get size() { return this._size };
    get type() { return this._type };
    get qualifier() { return this._qualifier };
    get labelName() { return this._labelName };

    get isConst()
    {
        return this._qualifier instanceof QualifierConst;
    }
}