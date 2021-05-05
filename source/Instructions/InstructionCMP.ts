import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionCMP extends Instruction
{
    constructor(public readonly type: Type, public readonly comparator: string)
    {
        super();
    }

    public write(): string
    {
        let instruction: string;

        switch (this.type.constructor)
        {
            case TypeInteger:
                instruction = "S";
                break;
            case TypeFloat:
                instruction = "F";
                break;
            case TypeUnsignedInteger:
                instruction = String();
                break;
            default:
                throw InternalErrors.generateError("Invalid type for CMP instruction.");
        }

        switch (this.comparator)
        {
            case "<":
                instruction += "CMPLT";
                break;
            case "<=":
                instruction += "CMPLTE";
                break;
            case ">":
                instruction += "CMPGT";
                break;
            case ">=":
                instruction += "CMPGTE";
                break;
            case "==":
                instruction += "CMPE";
                break;
            case "!=":
                instruction += "CMPNE";
                break;
        }

        return instruction + "\n";
    }
}