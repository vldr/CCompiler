import Scope from "../Scope";
import Type from "../Types/Type";
import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";
import Compiler from "../Compiler";

export default abstract class Variable
{
    public _labelName: string;

    constructor(
        protected _name: string,
        protected _type: Type,
        protected _scope: Scope,
        protected _compiler: Compiler,
        protected _shouldRead = true
    )
    {
        this._labelName = `${_scope.name.length > 0 ? _scope.name + "_" : ""}var_${this._name}`;
    }

    public abstract emit(): void;

    get scope() { return this._scope };
    get name() { return this._name };
    get type() { return this._type };

    get labelName() { return this._labelName };
    get shouldRead() { return this._shouldRead };
}