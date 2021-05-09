import Variable from "./Variable";
import Scope from "../Scope";
import Compiler from "../Compiler";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";

export default class VariablePrimitive extends Variable
{
    constructor(
        name: string,
        type: Type,
        scope: Scope,
        compiler: Compiler,
        shouldRead = true,
        private _initialValues: string[] = new Array(type.size).fill(0)
    )
    {
        super(name, type, scope, compiler, shouldRead);
    }

    getElement(index: number)
    {
        if (index >= this.type.size || index < 0)
            throw InternalErrors.generateError("Invalid index for get element.");

        let pseudoVariable = new VariablePrimitive(`${this.name}_${index}`, this._type.clone(1), this.scope, this._compiler, this._shouldRead, this._initialValues)
        pseudoVariable.setInitialValue = (_, value) =>
        {
            this.setInitialValue(index, value);
        };

        return pseudoVariable;
    }

    setInitialValue(index: number, value: string)
    {
        this._initialValues[index] = value;
    }

    emit(): void
    {
        this._compiler.emitToVariables(`${this.labelName}:\n`);

        if (this.type.size > 1)
        {
            for (let i = 0; i < this.type.size; i++)
            {
                this._compiler.emitToVariables(`${this.labelName}_${i}:\n`);
                this._compiler.emitToVariables(`.data ${this._initialValues[i]}\n`);
                this._compiler.emitToVariables(this.shouldRead ? `.read ${this.labelName}_${i} ${this.labelName}_${i}\n` : ``);
            }
        }
        else
        {
            this._compiler.emitToVariables(`.data ${this._initialValues}\n`);
            this._compiler.emitToVariables(this.shouldRead ? `.read ${this.labelName} ${this.labelName}\n` : ``);
        }
    }
}