import Variable from "./Variable";
import Function from "./Function"
import TypeStruct from "./Types/TypeStruct";
import Emittable from "./Emittable";
import Compiler from "./Compiler";

export default class Scope implements Emittable
{
    private _name: string;
    private _variables: Array<Variable>;
    private _structs: Array<TypeStruct>;
    private _scope: Scope | undefined;
    private _function: Function | undefined;

    constructor(private _compiler: Compiler, name?: string, scope?: Scope, functionIn?: Function)
    {
        this._name = name || "";

        if (scope)
            this._name = scope.name + this._name;

        this._scope = scope;
        this._function = functionIn;
        this._variables = new Array<Variable>();
        this._structs = new Array<TypeStruct>();
    }

    addStruct(struct: TypeStruct)
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

    getStructByName(name: string): TypeStruct | undefined
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

    emit(): void
    {
        this._variables.forEach((variable) =>
        {
            if (variable.size > 1)
            {
                this._compiler.emitToVariables(`${variable.labelName}:\n`);

                for (let i = 0; i < variable.size; i++)
                {
                    this._compiler.emitToVariables(
                        `${variable.labelName}_${i}:\n` +
                        `${variable.initialValue}\n` +

                        variable.shouldRead ? `.read ${variable.labelName}_${i} ${variable.labelName}_${i}\n` : ``
                    );
                }
            }
            else
            {
                this._compiler.emitToVariables(
                    `${variable.labelName}:\n` +
                    `${variable.initialValue}\n` +
                    variable.shouldRead ? `.read ${variable.labelName} ${variable.labelName}\n` : ``
                );
            }

        });
    }
}