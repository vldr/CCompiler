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
import QualifierNone from "../Qualifiers/QualifierNone";
import NodeUnary from "../Nodes/NodeUnary";
import InstructionNEG from "../Instructions/InstructionNEG";
import InstructionVGETA from "../Instructions/InstructionVGETA";
import ExpressionIdentifier from "./ExpressionIdentifier";
import InstructionINC from "../Instructions/InstructionINC";
import InstructionFINC from "../Instructions/InstructionFINC";
import InstructionSNEG from "../Instructions/InstructionSNEG";
import InstructionFNEG from "../Instructions/InstructionFNEG";
import InstructionNOT from "../Instructions/InstructionNOT";
import InstructionFDEC from "../Instructions/InstructionFDEC";
import InstructionDEC from "../Instructions/InstructionDEC";
import ExpressionResultVariable from "./ExpressionResultVariable";

export default class ExpressionUnary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeUnary;
        const operator = node.operator.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        let expressionResult = new ExpressionResult(destinationType, this);

        switch (operator)
        {
            case "~":
                expressionResult.pushExpressionResult(
                    this._compiler.generateExpression(
                        new DestinationRegisterA(destinationType), this._scope, expression
                    )
                );

                expressionResult.pushInstruction(new InstructionNOT());
                break;
            case "!":
                if (destinationType instanceof TypeFloat)
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, destinationType.toString(), "int | uint");
                }

                expressionResult.pushExpressionResult(
                    this._compiler.generateExpression(
                        new DestinationRegisterA(destinationType), this._scope, expression
                    )
                );

                expressionResult.pushInstruction(new InstructionNEG());
                break;
            case "-":
                if (destinationType instanceof TypeUnsignedInteger)
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, destinationType.toString(), "float | int");
                }

                expressionResult.pushExpressionResult(
                    this._compiler.generateExpression(
                        new DestinationRegisterA(destinationType), this._scope, expression
                    )
                );

                switch (destinationType.constructor)
                {
                    case TypeFloat:
                        expressionResult.pushInstruction(new InstructionSNEG());
                        break;
                    case TypeInteger:
                        expressionResult.pushInstruction(new InstructionFNEG());
                        break;
                    default:
                        throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operator, destinationType.toString());
                }
                break;
            case "++":
            case "--":
                const targetExpressionResult = this._compiler.generateExpression(
                    new DestinationRegisterA(destinationType), this._scope, expression
                ) as ExpressionResultVariable;

                if (!(targetExpressionResult instanceof ExpressionResultVariable))
                {
                    throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operator);
                }

                expressionResult = new ExpressionResultVariable(destinationType, this, targetExpressionResult.variable);
                expressionResult.pushExpressionResult(targetExpressionResult);

                switch (destinationType.constructor)
                {
                    case TypeFloat:
                        if (operator === "++")
                            expressionResult.pushInstruction(new InstructionFINC());
                        else
                            expressionResult.pushInstruction(new InstructionFDEC());
                        break;
                    case TypeInteger:
                    case TypeUnsignedInteger:
                        if (operator === "++")
                            expressionResult.pushInstruction(new InstructionINC());
                        else
                            expressionResult.pushInstruction(new InstructionDEC());
                        break;
                    default:
                        throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operator, destinationType.toString());
                }

                expressionResult.pushInstruction(new InstructionSAVE(targetExpressionResult.variable));

                break;
            default:
                throw InternalErrors.generateError(`Unsupported unary operator, '${operator}'.`);
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
        else if (destination instanceof DestinationNone)
        {
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

}