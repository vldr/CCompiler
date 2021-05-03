import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Variable from "../Variables/Variable";

export default class InstructionGETA extends Instruction
{
    constructor(private _variable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `GETA ${this._variable.labelName}\n`;
    }
}