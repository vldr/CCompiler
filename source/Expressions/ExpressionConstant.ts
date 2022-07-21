import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
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
import Utils from "../Utils";
import DestinationNone from "../Destinations/DestinationNone";
import QualifierNone from "../Qualifiers/QualifierNone";
import ExpressionResultConstant from "./ExpressionResultConstant";

export default class ExpressionConstant extends Expression
{
    generate(): ExpressionResultConstant
    {
        const node = this._node as NodeConstant;
        const destination = this._destination;
        const destinationType = this._destination.type;
        let typeName: string = node.type;
        let type: Type;

        const value: number = node.value_base10;
        let stringValue: string = value.toString();

        if (typeName === "int")
        {
            type = new TypeInteger(new QualifierNone(), 0);

            if (value > 2147483647 || value < -2147483648)
            {
                throw ExternalErrors.OUT_OF_BOUNDS_INT(node);
            }
        }
        else if (typeName === "uint")
        {
            type = new TypeUnsignedInteger(new QualifierNone(), 0);

            if (value < 0 || value > 4294967295)
            {
                throw ExternalErrors.OUT_OF_BOUNDS_UINT(node);
            }
        }
        else if (typeName === "float")
        {
            type = new TypeFloat(new QualifierNone(), 0);

            stringValue += "f";
        }
        else
        {
            throw InternalErrors.generateError("Unknown constant type.");
        }

        ///////////////////////////////////////////////

        const expressionResult = new ExpressionResultConstant(type, this, value);

        if (destination instanceof DestinationVariable)
        {
            if ((destination.variable.type.isConstant || (this._scope.getFunction() === undefined && destination.variable.scope.getFunction() === undefined)) && destination.variable instanceof VariablePrimitive)
            {
                destination.variable.setInitialValue(0, stringValue);
            }
            else if (Utils.isInlinable(type, value))
            {
                expressionResult.pushInstruction(new InstructionQSTORE(stringValue, destination.variable));
            }
            else
            {
                expressionResult.pushInstruction(new InstructionSTORE(stringValue, destination.variable));
            }
        }
        else if (
            destination instanceof DestinationRegisterA ||
            destination instanceof DestinationRegisterB ||
            destination instanceof DestinationStack
        )
        {
            if (Utils.isInlinable(type, value))
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
        else if (destination instanceof DestinationNone)
        {

        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destinationType.constructor}.`);
        }

        return expressionResult;
    }
}