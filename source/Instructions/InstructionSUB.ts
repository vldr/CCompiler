import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionSUB extends Instruction
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
                return `SSUB\n`;
            case TypeUnsignedInteger:
                return `SUB\n`;
            case TypeFloat:
                return `FSUB\n`;
            default:
                throw InternalErrors.generateError("Invalid type for SUB instruction.");
        }
    }
}