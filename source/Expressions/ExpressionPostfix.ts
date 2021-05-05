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
import ExpressionResultVariable from "./ExpressionResultVariable";
import InstructionFINC from "../Instructions/InstructionFINC";
import InstructionFDEC from "../Instructions/InstructionFDEC";
import InstructionINC from "../Instructions/InstructionINC";
import InstructionDEC from "../Instructions/InstructionDEC";
import NodeOperator from "../Nodes/NodeOperator";
import InstructionPUSH from "../Instructions/InstructionPUSH";
import InstructionPOP from "../Instructions/InstructionPOP";
import InstructionMOV from "../Instructions/InstructionMOV";
import InstructionGETB from "../Instructions/InstructionGETB";

export default class ExpressionPostfix extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeUnary;

        const operator = node.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        let expressionResult: ExpressionResult;

        if (operator.type === "operator")
        {
            const operatorNode: NodeOperator = operator;
            const operatorSymbol = operatorNode.operator;

            switch (operatorSymbol)
            {
                case "++":
                case "--":
                    const targetExpressionResult = this._compiler.generateExpression(
                        new DestinationRegisterA(destinationType), this._scope, expression
                    ) as ExpressionResultVariable;

                    if (!(targetExpressionResult instanceof ExpressionResultVariable))
                    {
                        throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operatorSymbol);
                    }

                    expressionResult = new ExpressionResultVariable(destinationType, this, targetExpressionResult.variable);

                    if (destination instanceof DestinationVariable)
                    {
                        expressionResult.pushInstruction(new InstructionMOV(targetExpressionResult.variable, destination.variable));
                    }
                    else if (destination instanceof DestinationRegisterB)
                    {
                        expressionResult.pushInstruction(new InstructionGETB(targetExpressionResult.variable));
                    }
                    else if (destination instanceof DestinationRegisterA || destination instanceof DestinationStack)
                    {
                        expressionResult.pushInstruction(new InstructionPUSH(targetExpressionResult.variable));
                    }

                    expressionResult.pushExpressionResult(targetExpressionResult);

                    switch (destinationType.constructor)
                    {
                        case TypeFloat:
                            if (operatorSymbol === "++")
                                expressionResult.pushInstruction(new InstructionFINC());
                            else
                                expressionResult.pushInstruction(new InstructionFDEC());
                            break;
                        case TypeInteger:
                        case TypeUnsignedInteger:
                            if (operatorSymbol === "++")
                                expressionResult.pushInstruction(new InstructionINC());
                            else
                                expressionResult.pushInstruction(new InstructionDEC());
                            break;
                        default:
                            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operatorSymbol, destinationType.toString());
                    }

                    expressionResult.pushInstruction(new InstructionSAVE(targetExpressionResult.variable));

                    if (destination instanceof DestinationRegisterA)
                    {
                        expressionResult.pushInstruction(new InstructionGETPOPA());
                    }
                    else if (destination instanceof DestinationVariable)
                    {
                    }
                    else if (destination instanceof DestinationRegisterB)
                    {
                    }
                    else if (destination instanceof DestinationStack)
                    {
                    }
                    else if (destination instanceof DestinationNone)
                    {
                    }
                    else
                    {
                        throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
                    }

                    break;
                default:
                    throw InternalErrors.generateError("Unsupported binary operator.");
            }
        }
        else
        {
            expressionResult = new ExpressionResult(destinationType, this);
        }



        return expressionResult;
    }

}