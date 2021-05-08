import Compiler from "../Compiler";
import Statement from "./Statement";
import NodeFunctionDefinition from "../Nodes/NodeFunctionDefinition";
import Utils from "../Utils";
import QualifierNone from "../Qualifiers/QualifierNone";
import Scope from "../Scope";
import ExternalErrors from "../Errors/ExternalErrors";
import Function from "../Function";
import Type from "../Types/Type";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import TypeFloat from "../Types/TypeFloat";
import TypeStruct from "../Types/TypeStruct";
import TypeVoid from "../Types/TypeVoid";
import Variable from "../Variables/Variable";
import VariableStruct from "../Variables/VariableStruct";
import VariablePrimitive from "../Variables/VariablePrimitive";
import InstructionRTN from "../Instructions/InstructionRTN";

export default class StatementFunctionDeclaration extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeFunctionDefinition;
        const returnTypeNode = node.returnType;
        const parametersNode = node.parameters;
        const bodyNode = node.body;
        const functionName = node.name;

        if (this._scope.getFunctionByName(functionName) !== undefined)
        {
            throw ExternalErrors.FUNCTION_NAME_TAKEN(node, functionName);
        }

        let returnType: Type;
        switch (returnTypeNode.name)
        {
            case "int":
                returnType = new TypeInteger(new QualifierNone(), 1);
                break;

            case "uint":
                returnType = new TypeUnsignedInteger(new QualifierNone(), 1);
                break;

            case "float":
                returnType = new TypeFloat(new QualifierNone(), 1);
                break;

            case "void":
                returnType = new TypeVoid(new QualifierNone(), 1);
                break;

            default:
            {
                throw ExternalErrors.UNSUPPORTED_RETURN_TYPE(node, returnTypeNode.name);
                break;
            }
        }

        const newScope = new Scope(this._compiler, functionName, this._scope);
        const newFunction = new Function(functionName, returnType, this._scope)

        this._compiler.addScope(newScope);
        this._scope.addFunction(newFunction);
        newScope.setFunction(newFunction);

        parametersNode.forEach((parameterNode) =>
        {
            const parameterTypeName = parameterNode.type_name;
            const parameterName = parameterNode.name;

            const size = parameterNode.arraySize?.value_base10 || 1;

            const qualifier = Utils.getQualifer(parameterNode, parameterNode.typeQualifier);
            const type = Utils.getType(parameterNode, parameterTypeName, size, qualifier, newScope);

            let variable: Variable;

            if (size > 1 || type instanceof TypeStruct)
            {
                throw ExternalErrors.CANNOT_NO_STRUCT_ARRAY(node);
            }
            else
            {
                variable = new VariablePrimitive(parameterName, type, newScope, this._compiler);
            }

            newScope.addVariable(
                variable
            );
        });

        this._compiler.emitToFunctions(`${newFunction.labelName}:\n`);

        bodyNode.statements.forEach((statementNode) => {
            this._compiler.generateAndEmitStatement(newScope, statementNode);
        });

        if (returnType instanceof TypeVoid)
            this._compiler.emitToFunctions(new InstructionRTN().write());
    }
}