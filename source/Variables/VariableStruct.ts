import Scope from "../Scope";
import Variable from "./Variable";
import Compiler from "../Compiler";
import TypeStruct from "../Types/TypeStruct";
import VariablePrimitive from "./VariablePrimitive";

export default class VariableStruct extends Variable
{
    public members = new Map<string, Variable>();
    private members__ = new Map<string, Variable>();

    constructor(
        name: string,
        type: TypeStruct,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true
    )
    {
        super(name, type, scope, compiler, shouldRead);

        if (type.arraySize > 0)
        {
            for (let i = 0; i < type.arraySize; i++)
            {
                type.members.forEach((variableType, variableName) =>
                {
                    this.members__.set(`${variableName}_${i}`,
                        variableType instanceof TypeStruct
                            ? new VariableStruct(`${name}__${variableName}_${i}`, variableType, scope, compiler, shouldRead) :
                            new VariablePrimitive(`${name}__${variableName}_${i}`, variableType, scope, compiler, shouldRead)
                    )
                });
            }
        }
        else {
            type.members.forEach((variableType, variableName) => {
                this.members__.set(variableName,
                    variableType instanceof TypeStruct
                        ? new VariableStruct(`${name}__${variableName}`, variableType, scope, compiler, shouldRead) :
                        new VariablePrimitive(`${name}__${variableName}`, variableType, scope, compiler, shouldRead)
                )
            });
        }

        type.members.forEach((variableType, variableName) => {
            this.members.set(variableName,
                variableType instanceof TypeStruct
                    ? new VariableStruct(`${name}__${variableName}`, variableType, scope, compiler, shouldRead) :
                    new VariablePrimitive(`${name}__${variableName}`, variableType, scope, compiler, shouldRead)
            )
        });
    }



    emit(): void
    {
        this._compiler.emitToVariables(`${this.labelName}:\n`);

        this.members__.forEach((variable) =>
        {
            variable.emit();
        });
    }
}