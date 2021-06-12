import Instruction from "./Instruction";

export default class InstructionGETAVB extends Instruction
{
    constructor(private _valueA: string, private _valueB: string)
    {
        super();
    }

    public write(): string
    {
        return `GETAVB ${this._valueA} ${this._valueB}\n`;
    }
}