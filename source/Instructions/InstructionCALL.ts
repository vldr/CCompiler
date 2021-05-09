import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Variable from "../Variables/Variable";
import Function from "../Function"

export default class InstructionCALL extends Instruction
{
    constructor(private _destinationFunction: Function)
    {
        super();
    }

    public write(): string
    {
        return `CALL ${this._destinationFunction.labelName}\n`;
    }
}