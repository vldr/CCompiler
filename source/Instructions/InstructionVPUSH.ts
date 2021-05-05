import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionVPUSH extends Instruction
{
    constructor(private _value: string)
    {
        super();
    }

    public write(): string
    {
        return `VPUSH ${this._value}\n`;
    }
}