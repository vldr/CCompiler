import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Compiler from "../Compiler";

export default class InstructionSAVEPUSH extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVEPUSH\n`;
    }
}