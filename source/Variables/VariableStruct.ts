import Scope from "../Scope";
import Variable from "./Variable";
import Compiler from "../Compiler";
import TypeStruct from "../Types/TypeStruct";

export default class VariableStruct extends Variable
{
    constructor(
        private _members: Map<string, Variable>,
        name: string,
        type: TypeStruct,
        scope: Scope,
        compiler: Compiler,
        size: number,
        initialValues = new Array(size).fill(0),
        shouldRead = true
    )
    {
        super(name, type, scope, compiler, size, initialValues, shouldRead);

        this._members.forEach((variable) =>
        {
            variable._labelName = this.labelName + "__" + variable._labelName;
        });
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