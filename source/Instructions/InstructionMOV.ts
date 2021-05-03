import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Variable from "../Variables/Variable";

export default class InstructionMOV extends Instruction
{
    constructor(
        private _srcVariable: Variable,
        private _dstVariable: DestinationVariable
    )
    {
        super();
    }

    public write(): string
    {
        return `MOV ${this._srcVariable.labelName} ${this._dstVariable.variable.labelName}\n`;
    }
}