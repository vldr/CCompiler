import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationStack from "../Destinations/DestinationStack";
import DestinationNone from "../Destinations/DestinationNone";
import InstructionSAVE from "../Instructions/InstructionSAVE";
import InstructionSAVETOA from "../Instructions/InstructionSAVETOA";
import InstructionSAVETOB from "../Instructions/InstructionSAVETOB";
import InstructionSAVEPUSH from "../Instructions/InstructionSAVEPUSH";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import TypeVoid from "../Types/TypeVoid";
import QualifierNone from "../Qualifiers/QualifierNone";
import NodeFunctionCall from "../Nodes/NodeFunctionCall";
import InstructionPOP from "../Instructions/InstructionPOP";
import InstructionCALL from "../Instructions/InstructionCALL";
import InstructionPOPNOP from "../Instructions/InstructionPOPNOP";
import InstructionRAND from "../Instructions/InstructionRAND";
import InstructionTICK from "../Instructions/InstructionTICK";
import InstructionSETLED from "../Instructions/InstructionSETLED";
import SymbolStruct from "../Symbols/SymbolStruct";
import SymbolFunction from "../Symbols/SymbolFunction";

export default class ExpressionFunctionCall extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeFunctionCall;
        const functionName = node.function_name;
        const nodeParameters = node.parameters;
        const functionIdentifier = node.identifier;

        if (functionName === "_push")
        {
            return this.generatePushIntrinsic(node);
        }
        else if (functionName === "_pop_uint" || functionName === "_pop_int" || functionName === "_pop_float")
        {
            return this.generatePopIntrinsic(node);
        }
        else if (functionName === "_load_a" || functionName === "_load_b")
        {
            return this.generateLoadIntrinsic(node);
        }
        else if (functionName === "_setled")
        {
            return this.generateSetLedIntrinsic(node);
        }
        else if (functionName === "_urand")
        {
            return this.generateURandIntrinsic(node);
        }
        else if (functionName === "_tick")
        {
            return this.generateTickIntrinsic(node);
        }

        const fn = this._scope.getFunctionByName(functionName);

        if (fn === undefined)
        {
            throw ExternalErrors.CANNOT_FIND_NAME(node, functionName);
        }

        const fnParameters = fn.parameters;
        const fnReturnType = fn.returnType;

        const destination = this._destination;

        this._compiler.addSymbol(new SymbolFunction(functionIdentifier.location));

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
            if (!(fnReturnType instanceof TypeVoid))
            {
                expressionResult.pushInstruction(new InstructionPOPNOP());
            }
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private generateLoadIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;
        const expectedParameters = 1;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        const returnType = new TypeVoid(new QualifierNone(), 0);

        let destination = functionName.endsWith("_a") ?
            new DestinationRegisterA(returnType) : new DestinationRegisterB(returnType);

        const targetExpressionResult = this._compiler.generateExpression(
            destination, this._scope, nodeParameters[0]
        );

        const expressionResult = new ExpressionResult(returnType, this);

        if ((targetExpressionResult.type instanceof TypeInteger ||
            targetExpressionResult.type instanceof TypeUnsignedInteger ||
            targetExpressionResult.type instanceof TypeFloat)
            && targetExpressionResult.type.arraySize <= 0
        )
        {
            expressionResult.pushExpressionResult(targetExpressionResult);
        }
        else
        {
            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_LOAD(node, targetExpressionResult.type.toString());
        }

        return expressionResult;
    }

    private generateSetLedIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;
        const expectedParameters = 1;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        const returnType = new TypeVoid(new QualifierNone(), 0);

        const targetExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(returnType), this._scope, nodeParameters[0]
        );
        const expressionResult = new ExpressionResult(returnType, this);

        if ((targetExpressionResult.type instanceof TypeInteger ||
            targetExpressionResult.type instanceof TypeUnsignedInteger ||
            targetExpressionResult.type instanceof TypeFloat)
            && targetExpressionResult.type.arraySize <= 0
        )
        {
            expressionResult.pushExpressionResult(targetExpressionResult);
            expressionResult.pushInstruction(new InstructionSETLED());
        }
        else
        {
            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_LOAD(node, targetExpressionResult.type.toString());
        }

        return expressionResult;
    }

    private generatePushIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;
        const expectedParameters = 1;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        const returnType = new TypeVoid(new QualifierNone(), 0);

        const targetExpressionResult = this._compiler.generateExpression(
            new DestinationStack(returnType), this._scope, nodeParameters[0]
        );

        const expressionResult = new ExpressionResult(returnType, this);

        if ((targetExpressionResult.type instanceof TypeInteger ||
            targetExpressionResult.type instanceof TypeUnsignedInteger ||
            targetExpressionResult.type instanceof TypeFloat)
            && targetExpressionResult.type.arraySize <= 0
        )
        {
            expressionResult.pushExpressionResult(targetExpressionResult);
        }
        else
        {
            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_PUSH(node, targetExpressionResult.type.toString());
        }

        return expressionResult;
    }

    private generatePopIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const destination = this._destination;

        const expectedParameters = 0;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        let returnType: Type;

        if (functionName.endsWith("_uint"))
        {
            returnType = new TypeUnsignedInteger(new QualifierNone(), 0);
        }
        else if (functionName.endsWith("_int"))
        {
            returnType = new TypeInteger(new QualifierNone(), 0);
        }
        else if (functionName.endsWith("_float"))
        {
            returnType = new TypeFloat(new QualifierNone(), 0);
        }
        else
        {
            throw InternalErrors.generateError("Invalid pop type.");
        }

        //////////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(returnType, this);

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
            expressionResult.pushInstruction(new InstructionPOPNOP());
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private generateTickIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const destination = this._destination;

        const expectedParameters = 0;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        //////////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(new TypeUnsignedInteger(new QualifierNone(), 0), this);
        expressionResult.pushInstruction(new InstructionTICK());

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

    private generateURandIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const destination = this._destination;

        const expectedParameters = 0;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        //////////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(new TypeUnsignedInteger(new QualifierNone(), 0), this);
        expressionResult.pushInstruction(new InstructionRAND());

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