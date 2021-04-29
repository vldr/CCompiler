import Scope from "./Scope";
import Type from "./Types/Type";
import Quantifier from "./Quantifiers/Quantifier";
import QuantifierConst from "./Quantifiers/QuantifierConst";

export default class Variable
{
    private _labelName: string;

    constructor(
        private _name: string,
        private _type: Type,
        private _quantifiers: Array<Quantifier>,
        private _scope: Scope
    )
    {
        this._labelName = `${_scope.name}_${this._name}`;
    }

    get isConst()
    {
        return this._quantifiers.find(q => q instanceof QuantifierConst) !== undefined;
    }

    get scope() { return this._scope };
    get name() { return this._name };
    get type() { return this._type };
    get labelName() { return this._labelName };
}