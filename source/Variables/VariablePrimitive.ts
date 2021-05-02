import Variable from "./Variable";

export default class VariablePrimitive extends Variable
{
    emit(): void
    {
        this._compiler.emitToVariables(`${this.labelName}:\n`);

        if (this.size > 1)
        {
            for (let i = 0; i < this.size; i++)
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