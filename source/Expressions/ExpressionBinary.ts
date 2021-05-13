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
import ExpressionResultAccessor from "./ExpressionResultAccessor";
import ExpressionResultVariable from "./ExpressionResultVariable";
import InstructionMOVOUT from "../Instructions/InstructionMOVOUT";
import InstructionGETPOPR from "../Instructions/InstructionGETPOPR";
import InstructionMOVINPOP from "../Instructions/InstructionMOVINPOP";
import InstructionMOVIN from "../Instructions/InstructionMOVIN";
import TypeStruct from "../Types/TypeStruct";
import TypeVoid from "../Types/TypeVoid";
import InstructionLOR from "../Instructions/InstructionLOR";
import InstructionLAND from "../Instructions/InstructionLAND";
import InstructionComment from "../Instructions/InstructionComment";
import ExpressionResultConstant from "./ExpressionResultConstant";

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
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, leftExpressionResult.type.toString(), rightExpressionResult.type.toString())

        if (destinationType.constructor !== TypeVoid && !leftExpressionResult.type.equals(destinationType))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, leftExpressionResult.type.toString(), destinationType.toString());

        if (destinationType.constructor !== TypeVoid && !rightExpressionResult.type.equals(destinationType))
            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, rightExpressionResult.type.toString(), destinationType.toString());

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
                (rightExpressionResult.variable.type instanceof TypeStruct || rightExpressionResult.variable.type.size > 1))
                throw ExternalErrors.CANNOT_COPY_STRUCT(node);

            if (operator != "=")
            {
                expressionResult.pushExpressionResult(leftExpressionResult);
                expressionResult.pushExpressionResult(rightExpressionResult);

                expressionResult.pushInstruction(new InstructionGETPOPB());
                expressionResult.pushInstruction(new InstructionGETPOPA());

                if (leftExpressionResult instanceof ExpressionResultAccessor)
                {
                    expressionResult.pushInstruction(new InstructionSAVEPUSH());
                }
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
                    expressionResult.pushExpressionResult(rightExpressionResult);
                    expressionResult.pushInstruction(new InstructionGETPOPR());
                    expressionResult.pushInstruction(new InstructionSAVE(leftExpressionResult.variable));
                }
                else
                {
                    throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operator);
                }
            }
        }
        else
        {
            expressionResult.pushExpressionResult(leftExpressionResult);
            expressionResult.pushExpressionResult(rightExpressionResult);

            expressionResult.pushInstruction(new InstructionGETPOPB());
            expressionResult.pushInstruction(new InstructionGETPOPA());
        }

        switch (operator)
        {
            case "=":
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
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionREM());
                break;
            case "<<":
            case "<<=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionSHIFTL());
                break;
            case ">>":
            case ">>=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionSHIFTR());
                break;
            case "||":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionLOR());
                break;
            case "|":
            case "|=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionOR());
                break;
            case "&&":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionLAND());
                break;
            case "&":
            case "&=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionAND());
                break;
            case "^":
            case "^=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
                expressionResult.pushInstruction(new InstructionXOR());
                break;


            case "<":
            case "<=":
            case ">":
            case ">=":
            case "==":
            case "!=":
                expressionResult.type = new TypeUnsignedInteger(expressionResult.type.qualifer, expressionResult.type.size);
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

    // TODO: Finish operand loading optimization.
    private loadOperand(
        expressionResult: ExpressionResult,
        leftExpressionResult: ExpressionResult,
        rightExpressionResult: ExpressionResult
    )
    {
         const isLeftInlinable = (leftExpressionResult instanceof ExpressionResultVariable ||
            leftExpressionResult instanceof ExpressionResultConstant);

         const isRightInlinable = (rightExpressionResult instanceof ExpressionResultVariable ||
             rightExpressionResult instanceof ExpressionResultConstant);

         if (!isLeftInlinable)
         {

         }

        // expressionResult.pushExpressionResult(leftExpressionResult);
        // expressionResult.pushExpressionResult(rightExpressionResult);
        //
        // expressionResult.pushInstruction(new InstructionGETPOPB());
        // expressionResult.pushInstruction(new InstructionGETPOPA());
    }

}