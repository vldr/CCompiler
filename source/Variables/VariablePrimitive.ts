import Variable from "./Variable";
import Scope from "../Scope";
import Compiler from "../Compiler";
import Type from "../Types/Type";

export default class VariablePrimitive extends Variable
{
    constructor(
        name: string,
        type: Type,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true,
        public initialValues: string[] = new Array(type.size).fill(0)
    )
    {
        super(name, type, scope, compiler, shouldRead);
    }

    emit(): void
    {
        if (this._shouldRead)
        {
            this._compiler.emitToVariables(`${this.labelName}:\n`);

            if (this.type.size > 1)
            {
                for (let i = 0; i < this.type.size; i++)
                {
                    this._compiler.emitToVariables(`${this.labelName}_${i}:\n`);
                    this._compiler.emitToVariables(`.data ${this.initialValues[i]}\n`);
                    this._compiler.emitToVariables(this.shouldRead ? `.read ${this.labelName}_${i} ${this.labelName}_${i}\n` : ``);
                }
            }
            else
            {
                this._compiler.emitToVariables(`.data ${this.initialValues}\n`);
                this._compiler.emitToVariables(this.shouldRead ? `.read ${this.labelName} ${this.labelName}\n` : ``);
            }
        }
    }
}