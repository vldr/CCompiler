import Scope from "../Scope";
import Variable from "./Variable";
import Compiler from "../Compiler";
import TypeStruct from "../Types/TypeStruct";
import VariablePrimitive from "./VariablePrimitive";

export default class VariableStruct extends Variable
{
    private _members = new Array<Variable>();

    constructor(
        name: string,
        type: TypeStruct,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true
    )
    {
        super(name, type, scope, compiler, shouldRead);

        if (type.size > 1)
        {
            for (let i = 0; i < type.size; i++)
            {
                type.members.forEach((variableType, variableName) =>
                {
                    this._members.push(
                        variableType instanceof TypeStruct
                            ? new VariableStruct(`${name}__${variableName}_${i}`, variableType, scope, compiler, shouldRead) :
                            new VariablePrimitive(`${name}__${variableName}_${i}`, variableType, scope, compiler, shouldRead)
                    )
                });
            }
        }
        else {
            type.members.forEach((variableType, variableName) => {
                this._members.push(
                    variableType instanceof TypeStruct
                        ? new VariableStruct(`${name}__${variableName}`, variableType, scope, compiler, shouldRead) :
                        new VariablePrimitive(`${name}__${variableName}`, variableType, scope, compiler, shouldRead)
                )
            });
        }
    }

    emit(): void
    {
        this._compiler.emitToVariables(`${this.labelName}:\n`);

        this._members.forEach((variable) =>
        {
            variable.emit();
        });
    }
}