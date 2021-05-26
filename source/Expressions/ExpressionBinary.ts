import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import NodeBinary from "../Nodes/NodeBinary";
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
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import ExpressionResultAccessor from "./ExpressionResultAccessor";
import ExpressionResultVariable from "./ExpressionResultVariable";
import InstructionGETPOPR from "../Instructions/InstructionGETPOPR";
import InstructionMOVINPOP from "../Instructions/InstructionMOVINPOP";
import TypeStruct from "../Types/TypeStruct";
import InstructionLOR from "../Instructions/InstructionLOR";
import InstructionLAND from "../Instructions/InstructionLAND";
import ExpressionResultConstant from "./ExpressionResultConstant";
import Node from "../Nodes/Node";
import Destination from "../Destinations/Destination";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJA from "../Instructions/InstructionJA";
import InstructionJNA from "../Instructions/InstructionJNA";
import InstructionVGETB from "../Instructions/InstructionVGETB";

export default class ExpressionBinary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeBinary;
        let operator = node.operator.operator;
        const destination = this._destination;
        const destinationType = destination.type;

        const left = node.left;
        const right = node.right;

        const leftExpressionResult = this._compiler.generateExpression(operator === "=" ? new DestinationNone(destinationType) : new DestinationStack(destinationType), this._scope, left);
        const rightExpressionResult = this._compiler.generateExpression(new DestinationStack(destinationType), this._scope, right);

        ////////////////////////////////////////////////////////////

        // Type Checking

        if (!leftExpressionResult.type.equals(rightExpressionResult.type))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, leftExpressionResult.type.toString(), rightExpressionResult.type.toString());

        ////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(leftExpressionResult.type, this);

        const isAssignment = (
            operator == "=" ||
            operator == "+=" ||
            operator == "-=" ||
            operator == "/=" ||
            operator == "*=" ||
            operator == "%=" ||
            operator == "|=" ||
            operator == "&=" ||
            operator == "^=" ||
            operator == "<<=" ||
            operator == ">>="
        );

        if (isAssignment)
        {
            if (leftExpressionResult instanceof ExpressionResultAccessor && leftExpressionResult.variable.type.isConstant)
            {
                throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, leftExpressionResult.variable.name);
            }
            else if (leftExpressionResult instanceof ExpressionResultVariable && leftExpressionResult.variable.type.isConstant)
            {
                throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, leftExpressionResult.variable.name);
            }

            if (rightExpressionResult instanceof ExpressionResultVariable &&
                (rightExpressionResult.variable.type instanceof TypeStruct || rightExpressionResult.variable.type.arraySize > 0))
                throw ExternalErrors.CANNOT_COPY_STRUCT(node);

            if (operator !== "=")
            {
                this.loadOperand(expressionResult, isAssignment, left, right, leftExpressionResult, rightExpressionResult);
            }
            else
            {
                if (leftExpressionResult instanceof ExpressionResultAccessor)
                {
                    expressionResult.pushExpressionResult(leftExpressionResult);
                    expressionResult.pushInstruction(new InstructionSAVEPUSH());
                    expressionResult.pushExpressionResult(rightExpressionResult);
                    expressionResult.pushInstruction(new InstructionGETPOPR());
                    expressionResult.pushInstruction(new InstructionMOVINPOP());
                }
                else if (leftExpressionResult instanceof ExpressionResultVariable)
                {
                    expressionResult.pushExpressionResult(
                        this._compiler.generateExpression(new DestinationVariable(destinationType, leftExpressionResult.variable), this._scope, right)
                    );
                }
                else
                {
                    throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operator);
                }
            }
        }
        else if (operator === "&&" || operator === "||")
        {
            this.generateLogicalExpression(expressionResult, node, left, right, operator);
        }
        else
        {
            this.loadOperand(expressionResult, isAssignment, left, right, leftExpressionResult, rightExpressionResult);
        }

        switch (operator)
        {
            case "=":
            case "&&":
            case "||":
                break;

            case "+":
            case "+=":
                expressionResult.pushInstruction(new InstructionADD(leftExpressionResult.type));
                break;
            case "-":
            case "-=":
                expressionResult.pushInstruction(new InstructionSUB(leftExpressionResult.type));
                break;
            case "/":
            case "/=":
                expressionResult.pushInstruction(new InstructionDIV(leftExpressionResult.type));
                break;
            case "*":
            case "*=":
                expressionResult.pushInstruction(new InstructionMULT(leftExpressionResult.type));
                break;

            case "%":
            case "%=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionREM());
                break;
            case "<<":
            case "<<=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionSHIFTL());
                break;
            case ">>":
            case ">>=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionSHIFTR());
                break;
            case "|":
            case "|=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionOR());
                break;
            case "&":
            case "&=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionAND());
                break;
            case "^":
            case "^=":
                if (expressionResult.type.constructor !== TypeUnsignedInteger &&
                    expressionResult.type.constructor !== TypeInteger)
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                        node, operator, expressionResult.type.toString()
                    );

                expressionResult.pushInstruction(new InstructionXOR());
                break;
            case "<":
            case "<=":
            case ">":
            case ">=":
            case "==":
            case "!=":
                if (expressionResult.type instanceof TypeInteger)
                    expressionResult.type = new TypeInteger(expressionResult.type.qualifer, expressionResult.type.arraySize);
                else if (expressionResult.type instanceof TypeFloat)
                    expressionResult.type = new TypeInteger(expressionResult.type.qualifer, expressionResult.type.arraySize);
                else
                    expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.arraySize);

                expressionResult.pushInstruction(new InstructionCMP(leftExpressionResult.type, operator));
                break;
            default:
                throw InternalErrors.generateError("Unsupported binary operator.");
        }

        if (isAssignment && operator != "=")
        {
            if (leftExpressionResult instanceof ExpressionResultAccessor)
            {
                expressionResult.pushInstruction(new InstructionMOVINPOP());
            }
            else if (leftExpressionResult instanceof ExpressionResultVariable)
            {
                expressionResult.pushInstruction(new InstructionSAVE(leftExpressionResult.variable));
            }
            else
            {
                throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operator);
            }
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

    private generateLogicalExpression(
        expressionResult: ExpressionResult,
        node: Node,
        leftNode: Node,
        rightNode: Node,
        operator: string
    )
    {
        if (expressionResult.type.constructor !== TypeUnsignedInteger && expressionResult.type.constructor !== TypeInteger)
        {
            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_BINARY_OPERATOR(
                node, operator, expressionResult.type.toString()
            );
        }

        const destination = this._destination;

        const leftExpressionResult = this._compiler.generateExpression(new DestinationRegisterA(destination.type), this._scope, leftNode);
        const rightExpressionResult = this._compiler.generateExpression(new DestinationRegisterA(destination.type), this._scope, rightNode);

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const expressionName = `${operator === "||" ? "or" : "and"}_expression_${substatementIndex}`;
        const finishLabel = `${this._scope.name}_${expressionName}_finish`;

        if (operator === "||")
        {
            expressionResult.pushExpressionResult(leftExpressionResult);
            expressionResult.pushInstruction(new InstructionJA(finishLabel));
            expressionResult.pushExpressionResult(rightExpressionResult);

            expressionResult.pushInstruction(new InstructionLabel(finishLabel));
            expressionResult.pushInstruction(new InstructionVGETB("0"));
            expressionResult.pushInstruction(new InstructionLOR());
        }
        else if (operator === "&&")
        {
            expressionResult.pushExpressionResult(leftExpressionResult);
            expressionResult.pushInstruction(new InstructionJNA(finishLabel));
            expressionResult.pushExpressionResult(rightExpressionResult);

            expressionResult.pushInstruction(new InstructionLabel(finishLabel));
            expressionResult.pushInstruction(new InstructionVGETB("1"));
            expressionResult.pushInstruction(new InstructionLAND());
        }
        else
        {
            throw InternalErrors.generateError("Unsupported binary logical operator.");
        }

        return expressionResult;
    }

    private loadOperand(
        expressionResult: ExpressionResult,
        isAssignment: boolean,
        leftNode: Node,
        rightNode: Node,
        leftExpressionResult: ExpressionResult,
        rightExpressionResult: ExpressionResult
    )
    {
        const isLeftInlinable = (leftExpressionResult instanceof ExpressionResultVariable ||
            leftExpressionResult instanceof ExpressionResultConstant);

        const isRightInlinable = (rightExpressionResult instanceof ExpressionResultVariable ||
            rightExpressionResult instanceof ExpressionResultConstant);

        const generateRight = (destination: Destination) => expressionResult.pushExpressionResult(
            this._compiler.generateExpression(destination, this._scope, rightNode)
        );

        const generateLeft = (destination: Destination) => expressionResult.pushExpressionResult(
            this._compiler.generateExpression(destination, this._scope, leftNode)
        );

        //////////////////////////////////////////////////////

        if (!isLeftInlinable && isRightInlinable)
        {
            generateLeft(new DestinationRegisterA(this._destination.type));

            if (isAssignment && leftExpressionResult instanceof ExpressionResultAccessor)
                expressionResult.pushInstruction(new InstructionSAVEPUSH());

            generateRight(new DestinationRegisterB(this._destination.type));
        }
        else if (isLeftInlinable && !isRightInlinable)
        {
            generateRight(new DestinationRegisterB(this._destination.type));
            generateLeft(new DestinationRegisterA(this._destination.type));
        }
        else if (isLeftInlinable && isRightInlinable)
        {
            generateLeft(new DestinationRegisterA(this._destination.type));
            generateRight(new DestinationRegisterB(this._destination.type));
        }
        else
        {
            generateRight(new DestinationStack(this._destination.type));
            generateLeft(new DestinationRegisterA(this._destination.type));

            expressionResult.pushInstruction(new InstructionGETPOPB());

            if (isAssignment && leftExpressionResult instanceof ExpressionResultAccessor)
                expressionResult.pushInstruction(new InstructionSAVEPUSH());
        }
    }
}