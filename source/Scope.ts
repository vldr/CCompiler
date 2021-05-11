import Function from "./Function"
import TypeStruct from "./Types/TypeStruct";
import Compiler from "./Compiler";
import Variable from "./Variables/Variable";
import Loop from "./Loop";

export default class Scope
{
    private _name: string;
    private _variables: Array<Variable>;
    private _structs: Array<TypeStruct>;
    private _functions: Array<Function>;
    private _scope: Scope | undefined;
    private _function?: Function;
    private _loop?: Loop;

    private _substatementIndex: number;

    constructor(private _compiler: Compiler, name?: string, scope?: Scope, fn?: Function)
    {
        this._name = name || "";

        if (scope)
            this._name = scope.name + this._name;

        this._scope = scope;
        this._variables = new Array<Variable>();
        this._structs = new Array<TypeStruct>();
        this._functions = new Array<Function>();
        this._function = fn;
        this._substatementIndex = 0;
    }

    getNextSubstatementIndex()
    {
        return this._substatementIndex++;
    }

    addStruct(struct: TypeStruct)
    {
        this._structs.push(struct);
    }

    addVariable(variable: Variable)
    {
        this._variables.push(variable);
    }

    addFunction(fn: Function)
    {
        this._functions.push(fn);
    }

    getVariableByNameInScope(name: string): Variable | undefined
    {
        return this._variables.find(s => s.name === name);
    }

    getVariableByName(name: string): Variable | undefined
    {
        const variable = this.getVariableByNameInScope(name);

        if (variable === undefined && this._scope)
        {
            return this._scope.getVariableByName(name);
        }

        return variable;
    }

    getStructByName(name: string): TypeStruct | undefined
    {
        const struct = this._structs.find(s => s.name === name);

        if (struct === undefined && this._scope)
        {
            return this._scope.getStructByName(name);
        }

        return struct;
    }

    getFunctionByName(name: string): Function | undefined
    {
        const theFunction = this._functions.find(s => s.name === name);

        if (theFunction === undefined && this._scope)
        {
            return this._scope.getFunctionByName(name);
        }

        return theFunction;
    }

    getFunction(): Function | undefined
    {
        if (this._function === undefined && this._scope)
        {
            return this._scope.getFunction();
        }

        return this._function;
    }

    setFunction(fn: Function): void
    {
        this._function = fn;
    }

    getLoop(): Loop | undefined
    {
        if (this._loop === undefined && this._scope)
        {
            return this._scope.getLoop();
        }

        return this._loop;
    }

    setLoop(loop: Loop): void
    {
        this._loop = loop;
    }

    get isRoot() { return this._scope === undefined; }
    get name() { return this._name; }

    emit(): void
    {
        this._variables.forEach((variable) =>
        {
            variable.emit();
        });
    }
}