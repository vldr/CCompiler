import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeFloat from "../Types/TypeFloat";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationVariable from "../Destinations/DestinationVariable";
import InstructionSTORE from "../Instructions/InstructionSTORE";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import InstructoinSTOREPUSH from "../Instructions/InstructionSTOREPUSH";
import DestinationStack from "../Destinations/DestinationStack";
import InstructoinGETPOPA from "../Instructions/InstructionGETPOPA";
import InstructoinGETPOPB from "../Instructions/InstructionGETPOPB";

export default class ExpressionConstant extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node;
        const destination = this._destination;
        const destinationType = this._destination.type;
        const typeName: string = node.type;

        let value: number = node.value_base10;

        switch (typeName)
        {
            case "int":
            case "uint":
                break;
            case "float":
                if (!(destinationType instanceof TypeFloat))
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(typeName, destinationType.toString(), node);

                break;
            default:
                throw InternalErrors.generateError(`Unknown constant type, ${typeName}.`);
        }

        const expressionResult = new ExpressionResult(destinationType, this);

        if (destination instanceof DestinationVariable)
        {
            if (destination.variable.isConst)
            {
                destination.variable.initialValues[0] = value.toString();

                if (destinationType instanceof TypeFloat)
                {
                    destination.variable.initialValues[0] += "f";
                }
            }
            else
            {
                expressionResult.pushInstruction(new InstructionSTORE(destinationType, value, destination));
            }
        }
        else if (
            destination instanceof DestinationRegisterA ||
            destination instanceof DestinationRegisterB ||
            destination instanceof DestinationStack
        )
        {
            expressionResult.pushInstruction(new InstructoinSTOREPUSH(destinationType, value));

            if (destination instanceof DestinationRegisterA)
            {
                expressionResult.pushInstruction(new InstructoinGETPOPA());
            }
            else if (destination instanceof DestinationRegisterB)
            {
                expressionResult.pushInstruction(new InstructoinGETPOPB());
            }
        }
        else
        {
            throw InternalErrors.generateError("Unknown destination type.");
        }

        return expressionResult;
    }

    private isInlinable(type: Type, value: number): boolean
    {
        let result = false;

        if (type instanceof TypeInteger || type instanceof TypeUnsignedInteger)
        {
            if (Number.isInteger(value) && value >= 0 && value <= 4095)
            {
                result = true;
            }
        }

        return result;
    }

}