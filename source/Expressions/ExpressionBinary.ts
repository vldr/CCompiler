import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import NodeBinary from "../Nodes/NodeBinary";
import Utils from "../Utils";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import InstructionADD from "../Instructions/InstructionADD";
import InstructionSUB from "../Instructions/InstructionSUB";
import InstructionDIV from "../Instructions/InstructionDIV";
import InstructionMULT from "../Instructions/InstructionMULT";
import InstructionREM from "../Instructions/InstructionREM";
import InstructionCMP from "../Instructions/InstructionCMP";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationStack from "../Destinations/DestinationStack";
import DestinationNone from "../Destinations/DestinationNone";
import InstructionSAVE from "../Instructions/InstructionSAVE";
import InstructionSAVETOA from "../Instructions/InstructionSAVETOA";
import InstructionSAVETOB from "../Instructions/InstructionSAVETOB";
import InstructionSAVEPUSH from "../Instructions/InstructionSAVEPUSH";
import InstructionSHIFTL from "../Instructions/InstructionSHIFTL";
import InstructionSHIFTR from "../Instructions/InstructionSHIFTR";
import InstructionOR from "../Instructions/InstructionOR";
import InstructionAND from "../Instructions/InstructionAND";
import InstructionXOR from "../Instructions/InstructionXOR";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";

export default class ExpressionBinary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeBinary;
        const operator = node.operator.operator;
        const destination = this._destination;
        const destinationType = destination.type;

        const left = node.left;
        const right = node.right;

        const leftExpressionResult = this._compiler.generateExpression(new DestinationStack(destinationType), this._scope, left);
        const rightExpressionResult = this._compiler.generateExpression(new DestinationStack(destinationType), this._scope, right);

        const expressionResult = new ExpressionResult(destinationType, this);

        if (destination instanceof DestinationNone)
        {
            return expressionResult;
        }

        if (!leftExpressionResult.type.equals(destinationType))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, leftExpressionResult.type.toString(), destinationType.toString());

        if (!rightExpressionResult.type.equals(destinationType))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, rightExpressionResult.type.toString(), destinationType.toString());

        expressionResult.pushExpressionResult(leftExpressionResult);
        expressionResult.pushExpressionResult(rightExpressionResult);

        expressionResult.pushInstruction(new InstructionGETPOPB());
        expressionResult.pushInstruction(new InstructionGETPOPA());

        switch (operator)
        {
            case "+":
                expressionResult.pushInstruction(new InstructionADD(destinationType));
                break;
            case "-":
                expressionResult.pushInstruction(new InstructionSUB(destinationType));
                break;
            case "/":
                expressionResult.pushInstruction(new InstructionDIV(destinationType));
                break;
            case "*":
                expressionResult.pushInstruction(new InstructionMULT(destinationType));
                break;
            case "%":
                expressionResult.pushInstruction(new InstructionREM());
                break;
            case "<<":
                expressionResult.pushInstruction(new InstructionSHIFTL());
                break;
            case ">>":
                expressionResult.pushInstruction(new InstructionSHIFTR());
                break;
            case "|":
                expressionResult.pushInstruction(new InstructionOR());
                break;
            case "&":
                expressionResult.pushInstruction(new InstructionAND());
                break;
            case "^":
                expressionResult.pushInstruction(new InstructionXOR());
                break;
            case "<":
            case "<=":
            case ">":
            case ">=":
            case "==":
            case "!=":
                if (destinationType instanceof TypeFloat)
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, destinationType.toString(), "int | uint");
                }

                expressionResult.pushInstruction(new InstructionCMP(destinationType, operator));
                break;
            default:
                throw InternalErrors.generateError("Unsupported binary operator.");
        }

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionSAVE(destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionSAVETOA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionSAVETOB());
        }
        else if (destination instanceof DestinationStack)
        {
            expressionResult.pushInstruction(new InstructionSAVEPUSH());
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }
}