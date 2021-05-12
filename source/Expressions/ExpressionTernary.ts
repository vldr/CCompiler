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
import NodeTernary from "../Nodes/NodeTernary";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJNA from "../Instructions/InstructionJNA";
import InstructionJMP from "../Instructions/InstructionJMP";

export default class ExpressionTernary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeTernary;
        const conditionNode = node.condition;
        const isTrueNode = node.is_true;
        const isFalseNode = node.is_false;

        const destination = this._destination;
        const destinationType = destination.type;

        const conditionExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(destinationType), this._scope, conditionNode
        );

        if (!conditionExpressionResult.type.equals(new TypeInteger(new QualifierNone(), 1))
            && !conditionExpressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 1)))
        {
            throw ExternalErrors.CANNOT_CONVERT_TYPE(conditionNode, conditionExpressionResult.type.toString(), "int | uint");
        }

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const expressionName = `ternary_expression_${substatementIndex}`;
        const alternateLabel = `${this._scope.name}_${expressionName}_alternate`
        const finishLabel = `${this._scope.name}_${expressionName}_finish`

        let expressionResult = new ExpressionResult(conditionExpressionResult.type, this);

        expressionResult.pushExpressionResult(conditionExpressionResult);
        expressionResult.pushInstruction(new InstructionJNA(alternateLabel));

        const isTrueExpressionResult = this._compiler.generateExpression(
            destination, this._scope, isTrueNode
        );
        expressionResult.pushExpressionResult(isTrueExpressionResult);
        expressionResult.pushInstruction(new InstructionJMP(finishLabel));

        expressionResult.pushInstruction(new InstructionLabel(alternateLabel));

        const isFalseExpressionResult = this._compiler.generateExpression(
            destination, this._scope, isFalseNode
        );
        expressionResult.pushExpressionResult(isFalseExpressionResult);
        expressionResult.pushInstruction(new InstructionLabel(finishLabel));

        if (!isTrueExpressionResult.type.equals(isFalseExpressionResult.type))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, isTrueExpressionResult.type.toString(), isFalseExpressionResult.type.toString())

        expressionResult.type = isTrueExpressionResult.type.clone(1);

        return expressionResult;
    }

}