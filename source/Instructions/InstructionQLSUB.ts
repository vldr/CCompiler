import Instruction from "./Instruction";

export default class InstructionQLSUB extends Instruction
{
    constructor(private _valueA: string, private _valueB: string)
    {
        super();
    }

    public write(): string
    {
        return `QLSUB ${this._valueA} ${this._valueB}\n`;
    }
}