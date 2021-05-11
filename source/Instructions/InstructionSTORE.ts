import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Variable from "../Variables/Variable";

export default class InstructionSTORE extends Instruction
{
    constructor(
        private _value: string,
        private _destinationVariable: Variable
    )
    {
        super();
    }

    public write(): string
    {
        return `STORE ${this._value} ${this._destinationVariable.labelName}\n`;
    }
}