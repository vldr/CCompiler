import Instruction from "./Instruction";

export default class InstructionQLADD extends Instruction
{
    constructor(private _valueA: string, private _valueB: string)
    {
        super();
    }

    public write(): string
    {
        return `QLADD ${this._valueA} ${this._valueB}\n`;
    }
}