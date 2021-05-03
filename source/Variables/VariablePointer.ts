import Variable from "./Variable";
import Scope from "../Scope";
import Compiler from "../Compiler";
import Type from "../Types/Type";

export default class VariablePointer extends Variable
{
    constructor(
        name: string,
        type: Type,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true
    )
    {
        super(name, type, scope, compiler, shouldRead);
    }

    emit(): void
    {
        this._compiler.emitToVariables(`${this.labelName}:\n`);
        this._compiler.emitToVariables(`.data 0\n`);
        this._compiler.emitToVariables(this.shouldRead ? `.read ${this.labelName} ${this.labelName}\n` : ``);
    }
}