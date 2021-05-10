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
import QualifierNone from "../Qualifiers/QualifierNone";
import NodeFunctionCall from "../Nodes/NodeFunctionCall";
import InstructionPOP from "../Instructions/InstructionPOP";
import InstructionCALL from "../Instructions/InstructionCALL";

export default class ExpressionFunctionCall extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeFunctionCall;
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const fn = this._scope.getFunctionByName(functionName);

        if (fn === undefined)
        {
            throw ExternalErrors.CANNOT_FIND_NAME(node, functionName);
        }

        const fnParameters = fn.parameters;
        const fnReturnType = fn.returnType;

        const destination = this._destination;
        const destinationType = destination.type;

        ////////////////////////////////////////////////////////////

        if (fnParameters.length !== nodeParameters.length)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, fnParameters.length, nodeParameters.length);
        }

        const expressionResult = new ExpressionResult(fnReturnType, this);

        fnParameters.forEach((parameter, index) =>
        {
            const targetExpressionResult = this._compiler.generateExpression(
                new DestinationVariable(parameter.type, parameter), this._scope, nodeParameters[index]
            );

            if (!targetExpressionResult.type.equals(parameter.type))
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, targetExpressionResult.type.toString(), parameter.type.toString());
            }

            expressionResult.pushExpressionResult(targetExpressionResult);
        });

        ////////////////////////////////////////////////////////////

        expressionResult.pushInstruction(new InstructionCALL(fn));

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionPOP(destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionGETPOPA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionGETPOPB());
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

        return expressionResult;
    }
}