import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
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

        if (!conditionExpressionResult.type.equals(new TypeInteger(new QualifierNone(), 0))
            && !conditionExpressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 0)))
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

        expressionResult.type = isTrueExpressionResult.type.cloneSingular();

        return expressionResult;
    }

}