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
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationStack from "../Destinations/DestinationStack";
import InstructionQSTORE from "../Instructions/InstructionQSTORE";
import InstructionSTORE from "../Instructions/InstructionSTORE";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionSTOREPUSH from "../Instructions/InstructionSTOREPUSH";
import InstructionVPUSH from "../Instructions/InstructionVPUSH";
import InstructionVGETA from "../Instructions/InstructionVGETA";
import InstructionVGETB from "../Instructions/InstructionVGETB";
import NodeConstant from "../Nodes/NodeConstant";
import VariablePrimitive from "../Variables/VariablePrimitive";

export default class ExpressionConstant extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeConstant;
        const destination = this._destination;
        const destinationType = this._destination.type;
        const typeName: string = node.type;

        const value: number = node.value_base10;
        let stringValue: string = value.toString();

        if (typeName === "int")
        {
            if (destinationType instanceof TypeFloat) { stringValue += "f"; }
            else if (destinationType instanceof TypeInteger) {}
            else if (destinationType instanceof TypeUnsignedInteger) {}
            else
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, typeName, destinationType.toString());
            }
        }
        else if (typeName === "uint")
        {
            if (destinationType instanceof TypeFloat) { stringValue += "f"; }
            else if (destinationType instanceof TypeInteger) {}
            else if (destinationType instanceof TypeUnsignedInteger) {}
            else
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, typeName, destinationType.toString());
            }
        }
        else if (typeName === "float")
        {
            if (destinationType instanceof TypeFloat) {}
            else
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, typeName, destinationType.toString());
            }
        }

        ///////////////////////////////////////////////

        const expressionResult = new ExpressionResult(destinationType, this);

        if (destination instanceof DestinationVariable)
        {
            if (destination.variable.type.isConstant && destination.variable instanceof  VariablePrimitive)
            {
                destination.variable.initialValues[0] = stringValue;
            }
            else if (this.isInlinable(destinationType, value))
            {
                expressionResult.pushInstruction(new InstructionQSTORE(stringValue, destination));
            }
            else
            {
                expressionResult.pushInstruction(new InstructionSTORE(stringValue, destination));
            }
        }
        else if (
            destination instanceof DestinationRegisterA ||
            destination instanceof DestinationRegisterB ||
            destination instanceof DestinationStack
        )
        {
            if (this.isInlinable(destinationType, value))
            {
                if (destination instanceof DestinationRegisterA)
                {
                    expressionResult.pushInstruction(new InstructionVGETA(stringValue));
                }
                else if (destination instanceof DestinationRegisterB)
                {
                    expressionResult.pushInstruction(new InstructionVGETB(stringValue));
                }
                else
                {
                    expressionResult.pushInstruction(new InstructionVPUSH(stringValue));
                }
            }
            else
            {
                expressionResult.pushInstruction(new InstructionSTOREPUSH(stringValue));

                if (destination instanceof DestinationRegisterA)
                {
                    expressionResult.pushInstruction(new InstructionGETPOPA());
                }
                else if (destination instanceof DestinationRegisterB)
                {
                    expressionResult.pushInstruction(new InstructionGETPOPB());
                }
            }
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destinationType.constructor}.`);
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