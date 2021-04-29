import Variable from "./Variable";
import Function from "./Function"
import Struct from "./Types/Struct";

export default class Scope
{
    private _name: string;
    private _variables: Array<Variable>;
    private _structs: Array<Struct>;
    private _scope: Scope | undefined;
    private _function: Function | undefined;

    constructor(name?: string, scope?: Scope, functionIn?: Function)
    {
        this._name = name || "";

        if (scope)
            this._name = scope.name + this._name;

        this._scope = scope;
        this._function = functionIn;
        this._variables = new Array<Variable>();
        this._structs = new Array<Struct>();
    }

    addStruct(struct: Struct)
    {
        this._structs.push(struct);
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

    getStructByName(name: string): Struct | undefined
    {
        const struct = this._structs.find(s => s.name === name);

        if (struct === undefined && this._scope)
        {
            return this._scope.getStructByName(name);
        }

        return struct;
    }

    getFunction(): Function | undefined
    {
        if (this._function === undefined && this._scope)
        {
            return this._scope.getFunction();
        }

        return this._function;
    }

    get name() { return this._name; }
}