import Instruction from "./Instruction";

export default class InstructionQSUB extends Instruction
{
    constructor(private _valueA: string, private _valueB: string)
    {
        super();
    }

    public write(): string
    {
        return `QSUB ${this._valueA} ${this._valueB}\n`;
    }
}