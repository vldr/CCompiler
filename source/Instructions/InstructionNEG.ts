import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionNEG extends Instruction
{
    constructor(public readonly type: Type)
    {
        super();
    }

    public write(): string
    {
        switch (this.type.constructor)
        {
            case TypeInteger:
                return `SNEG\n`;
            case TypeUnsignedInteger:
                return `NEG\n`;
            case TypeFloat:
                return `FNEG\n`;
            default:
                throw InternalErrors.generateError("Invalid type for NEG instruction.");
        }
    }
}