import Scope from "../Scope";
import Variable from "./Variable";
import Compiler from "../Compiler";
import TypeStruct from "../Types/TypeStruct";
import Type from "../Types/Type";
import VariablePrimitive from "./VariablePrimitive";

export default class VariableStruct extends Variable
{
    private _members = new Map<string, Variable>();

    constructor(
        name: string,
        type: TypeStruct,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true
    )
    {
        super(name, type, scope, compiler, shouldRead);

        type.members.forEach((variableType, variableName) =>
        {
            this._members.set(`${name}__${variableName}`,
                variableType instanceof TypeStruct
                    ? new VariablePrimitive(name, type, scope, compiler, shouldRead) :
                    new VariableStruct(name, type, scope, compiler, shouldRead)
            )
        });
    }

    emit(): void
    {
        if (this._shouldRead)
        {
            this._compiler.emitToVariables(`${this.labelName}:\n`);
            this._members.forEach((variable) =>
            {
                variable.emit();
            });
        }
    }
}