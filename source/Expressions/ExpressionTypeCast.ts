import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationStack from "../Destinations/DestinationStack";
import QualifierNone from "../Qualifiers/QualifierNone";
import DestinationNone from "../Destinations/DestinationNone";
import TypeVoid from "../Types/TypeVoid";
import NodeTypeCast from "../Nodes/NodeTypeCast";
import InstructionINTTOFL from "../Instructions/InstructionINTTOFL";
import InstructionFLTOINT from "../Instructions/InstructionFLTOINT";
import Destination from "../Destinations/Destination";
import InstructionSAVE from "../Instructions/InstructionSAVE";
import InstructionSAVETOA from "../Instructions/InstructionSAVETOA";
import InstructionSAVETOB from "../Instructions/InstructionSAVETOB";
import InstructionSAVEPUSH from "../Instructions/InstructionSAVEPUSH";
import TypeStruct from "../Types/TypeStruct";

export default class ExpressionTypeCast extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeTypeCast;
        const cast_to = node.cast_to;
        const expression = node.expression;

        const destination = this._destination;
        const destinationType = destination.type;

        const targetExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)), this._scope, expression
        );

        if (targetExpressionResult.type.arraySize > 0 || targetExpressionResult.type instanceof TypeStruct)
        {
            throw ExternalErrors.CANNOT_NO_STRUCT_ARRAY(node);
        }

        switch (cast_to)
        {
            case "int":
                if (targetExpressionResult.type instanceof TypeInteger || targetExpressionResult.type instanceof TypeUnsignedInteger)
                {
                    const expr = this._compiler.generateExpression(
                        destination, this._scope, expression
                    );
                    expr.type = new TypeInteger(expr.type.qualifer, expr.type.arraySize);

                    return expr;
                }
                else if (targetExpressionResult.type instanceof TypeFloat)
                {
                    const expressionResult = new ExpressionResult(
                        new TypeInteger(targetExpressionResult.type.qualifer, targetExpressionResult.type.arraySize),
                        this
                    );

                    expressionResult.pushExpressionResult(targetExpressionResult);
                    expressionResult.pushInstruction(new InstructionFLTOINT());
                    this.save(destination, expressionResult);

                    return expressionResult;
                }
                else
                {
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_TYPE_CAST(node, targetExpressionResult.type.toString(), cast_to);
                }
            case "uint":
                if (
                    targetExpressionResult.type instanceof TypeInteger ||
                    targetExpressionResult.type instanceof TypeUnsignedInteger ||
                    targetExpressionResult.type instanceof TypeFloat
                )
                {
                    const expr = this._compiler.generateExpression(
                        destination, this._scope, expression
                    );
                    expr.type = new TypeUnsignedInteger(expr.type.qualifer, expr.type.arraySize);

                    return expr;
                }
                else
                {
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_TYPE_CAST(node, targetExpressionResult.type.toString(), cast_to);
                }
            case "float":
                if (targetExpressionResult.type instanceof TypeInteger)
                {
                    const expressionResult = new ExpressionResult(
                        new TypeFloat(targetExpressionResult.type.qualifer, targetExpressionResult.type.arraySize),
                        this
                    );

                    expressionResult.pushExpressionResult(targetExpressionResult);
                    expressionResult.pushInstruction(new InstructionINTTOFL());
                    this.save(destination, expressionResult);

                    return expressionResult;
                }
                else if (
                    targetExpressionResult.type instanceof TypeFloat ||
                    targetExpressionResult.type instanceof TypeUnsignedInteger
                )
                {
                    const expr = this._compiler.generateExpression(
                        destination, this._scope, expression
                    );
                    expr.type = new TypeFloat(expr.type.qualifer, expr.type.arraySize);

                    return expr;
                }
                else
                {
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_TYPE_CAST(node, targetExpressionResult.type.toString(), cast_to);
                }
            default:
                throw InternalErrors.generateError("Invalid cast_to type.");
        }
    }

    private save(destination: Destination, expressionResult: ExpressionResult)
    {
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
    }
}