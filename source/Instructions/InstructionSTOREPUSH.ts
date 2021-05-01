import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructoinSTOREPUSH extends Instruction
{
    constructor(
        private _type: Type,
        private _value: number,
    )
    {
        super();
    }

    public write(): string
    {
        let stringValue: string;

        switch (this._type.constructor)
        {
            case TypeInteger:
            case TypeUnsignedInteger:
                stringValue = this._value.toString();
                break;
            case TypeFloat:
                stringValue = this._value + "f";
                break;
            default:
                throw InternalErrors.generateError(
                    `Cannot generate instruction because unsupported type ${this._type.constructor}`
                );
        }

        return `STOREPUSH ${stringValue}\n`;
    }
}