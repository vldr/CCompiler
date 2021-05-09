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
import InstructionMOVINPOP from "../Instructions/InstructionMOVINPOP";
import InstructionSTOREPUSH from "../Instructions/InstructionSTOREPUSH";
import ExpressionResultAccessor from "./ExpressionResultAccessor";
import ExpressionResultVariable from "./ExpressionResultVariable";
import TypeVoid from "../Types/TypeVoid";

export default class ExpressionUnary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeUnary;
        const operator = node.operator.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        let targetExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(destinationType), this._scope, expression
        );

        if (destinationType.constructor !== TypeVoid && !destination.type.equals(targetExpressionResult.type))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, targetExpressionResult.type.toString(), destination.type.toString());

        let expressionResult = new ExpressionResult(targetExpressionResult.type, this);

        switch (operator)
        {
            case "~":
                expressionResult.pushExpressionResult(targetExpressionResult);
                expressionResult.pushInstruction(new InstructionNOT());
                break;
            case "!":
                if (targetExpressionResult.type instanceof TypeFloat)
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, targetExpressionResult.type.toString(), "int | uint");
                }

                expressionResult.pushExpressionResult(targetExpressionResult);
                expressionResult.pushInstruction(new InstructionNEG());

                break;
            case "-":
                if (targetExpressionResult.type instanceof TypeUnsignedInteger)
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, targetExpressionResult.type.toString(), "float | int");
                }

                expressionResult.pushExpressionResult(targetExpressionResult);

                switch (targetExpressionResult.type.constructor)
                {
                    case TypeFloat:
                        expressionResult.pushInstruction(new InstructionFNEG());
                        break;
                    case TypeInteger:
                        expressionResult.pushInstruction(new InstructionSNEG());
                        break;
                    default:
                        throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operator, targetExpressionResult.type.toString());
                }
                break;
            case "++":
            case "--":
                if (targetExpressionResult instanceof ExpressionResultVariable)
                {
                    if ((targetExpressionResult as ExpressionResultVariable).variable.type.isConstant)
                    {
                        throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, targetExpressionResult.variable.name);
                    }
                }
                else if (targetExpressionResult instanceof ExpressionResultAccessor)
                {
                    if (targetExpressionResult.variable.type.isConstant)
                    {
                        throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, targetExpressionResult.variable.name);
                    }
                }
                else
                {
                    throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operator);
                }

                expressionResult = new ExpressionResult(targetExpressionResult.type, this);
                expressionResult.pushExpressionResult(targetExpressionResult);

                if (targetExpressionResult instanceof ExpressionResultAccessor)
                {
                    expressionResult.pushInstruction(new InstructionSAVEPUSH());
                }

                switch (targetExpressionResult.type.constructor)
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
                        throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operator, targetExpressionResult.type.toString());
                }

                if (targetExpressionResult instanceof ExpressionResultVariable)
                {
                    expressionResult.pushInstruction(new InstructionSAVE(targetExpressionResult.variable));
                }
                else if (targetExpressionResult instanceof ExpressionResultAccessor)
                {
                    expressionResult.pushInstruction(new InstructionMOVINPOP());
                }

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