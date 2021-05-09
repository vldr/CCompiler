import Compiler from "../Compiler";
import Statement from "./Statement";
import Instruction from "../Instructions/Instruction";
import Type from "../Types/Type";
import TypeInteger from "../Types/TypeInteger";
import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import InternalErrors from "../Errors/InternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import DestinationVariable from "../Destinations/DestinationVariable";
import TypeStruct from "../Types/TypeStruct";
import Utils from "../Utils";
import NodeDeclarator from "../Nodes/NodeDeclarator";
import Variable from "../Variables/Variable";
import VariablePrimitive from "../Variables/VariablePrimitive";
import VariableStruct from "../Variables/VariableStruct";
import NodeReturn from "../Nodes/NodeReturn";
import TypeVoid from "../Types/TypeVoid";
import DestinationNone from "../Destinations/DestinationNone";
import DestinationStack from "../Destinations/DestinationStack";
import InstructionRTN from "../Instructions/InstructionRTN";
import ExpressionResultVariable from "../Expressions/ExpressionResultVariable";
import ExpressionResultAccessor from "../Expressions/ExpressionResultAccessor";

export default class StatementReturn extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeReturn;
        const value = node.value;

        const functionScope = this._scope.getFunction();

        if (functionScope === undefined)
        {
            throw ExternalErrors.RETURN_MUST_BE_IN_FUNCTION(node);
        }

        const returnType = functionScope.returnType;

        if (value)
        {
            const expressionResult = this._compiler.generateExpression(new DestinationStack(returnType), this._scope, value);

            if (!expressionResult.type.equals(returnType))
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(value, returnType.toString(), expressionResult.type.toString());
            }

            this._compiler.emitToFunctions(expressionResult.write());
        }
        else
        {
            if (!(returnType instanceof TypeVoid))
            {
                throw ExternalErrors.RETURN_EXPECTING_NON_VOID_VALUE(node);
            }
        }

        this._compiler.emitToFunctions(new InstructionRTN().write());
    }
}