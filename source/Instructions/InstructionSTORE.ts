import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import Errors from "../Errors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionSTORE extends Instruction
{
    constructor(
        private _type: Type,
        private _value: number,
        private _destinationVariable: DestinationVariable
    )
    {
        super();
    }

    public emit(): string
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
                throw Errors.UNSUPPORTED_VALUE_TYPE(this._type.constructor);
        }

        return `STORE ${stringValue} ${this._destinationVariable.variable.labelName}`;
    }
}