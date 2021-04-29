import Variable from "./Variable";
import Struct from "./Struct";

export default class Scope
{
    private _name: string;
    private _variables: Array<Variable>;
    private _structs: Array<Struct>;
    private _scope: Scope | undefined;

    constructor(name?: string, scope?: Scope)
    {
        this._name = name || "";
        this._scope = scope;
        this._variables = new Array<Variable>();
    }

    addVariable(variable: Variable)
    {
        this._variables.push(variable);
    }

    getVariableByName(name: string): Variable | undefined
    {
        const variable = this._variables.find(s => s.name === name);

        if (variable === undefined && this._scope)
        {
            return this._scope.getVariableByName(name);
        }

        return variable;
    }

    get name() { return this._name; }
}