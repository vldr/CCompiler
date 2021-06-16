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
import VariablePrimitive from "../Variables/VariablePrimitive";
import InstructionRTN from "../Instructions/InstructionRTN";
import CodePathAnalysis from "../CodePathAnalysis";
import ExternalWarnings from "../Errors/ExternalWarnings";
import SymbolFunction from "../Symbols/SymbolFunction";

export default class StatementFunctionDeclaration extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeFunctionDefinition;
        const returnTypeNode = node.returnType;
        const parametersNode = node.parameters;
        const bodyNode = node.body;
        const functionName = node.name;
        const functionIdentifierNode = node.identifier;

        if (functionName.startsWith("_"))
        {
            throw ExternalErrors.FUNCTION_NAME_UNDERSCORE(functionIdentifierNode);
        }

        if (this._scope.getFunctionByName(functionName) !== undefined)
        {
            throw ExternalErrors.FUNCTION_NAME_TAKEN(functionIdentifierNode, functionName);
        }

        let returnType: Type;
        switch (returnTypeNode.name)
        {
            case "int":
                returnType = new TypeInteger(new QualifierNone(), 0);
                break;

            case "uint":
                returnType = new TypeUnsignedInteger(new QualifierNone(), 0);
                break;

            case "float":
                returnType = new TypeFloat(new QualifierNone(), 0);
                break;

            case "void":
                returnType = new TypeVoid(new QualifierNone(), 0);
                break;

            default:
                throw ExternalErrors.UNSUPPORTED_RETURN_TYPE(node, returnTypeNode.name);
        }

        if (returnType.constructor !== TypeVoid && !CodePathAnalysis.returnsAllPaths(bodyNode))
        {
            ExternalWarnings.NOT_ALL_PATHS_RETURN(functionIdentifierNode, this._compiler);
        }

        this._compiler.addSymbol(new SymbolFunction(functionIdentifierNode.location));

        const newScope = new Scope(this._compiler, functionName, this._scope);
        const newFunction = new Function(functionName, returnType, this._scope)

        this._compiler.addScope(newScope);
        this._scope.addFunction(newFunction);
        newScope.setFunction(newFunction);

        parametersNode.forEach((parameterNode) =>
        {
            const parameterTypeName = parameterNode.type_name;
            const parameterName = parameterNode.name;

            const size = parameterNode.arraySize?.value_base10 || 0;

            const qualifier = Utils.getQualifer(parameterNode, parameterNode.typeQualifier);
            const type = Utils.getType(parameterNode, parameterTypeName, size, qualifier, newScope);

            let variable: Variable;

            if (size > 0 || type instanceof TypeStruct)
            {
                throw ExternalErrors.CANNOT_NO_STRUCT_ARRAY(parameterNode);
            }
            else
            {
                variable = new VariablePrimitive(parameterName, type, newScope, this._compiler);
            }

            newFunction.parameters.push(variable);

            newScope.addVariable(
                variable
            );
        });

        this._compiler.emitToFunctions(`\n${newFunction.labelName}:\n`);

        bodyNode.statements.forEach((statementNode) => {
            this._compiler.generateAndEmitStatement(newScope, statementNode);
        });

        if (returnType instanceof TypeVoid)
            this._compiler.emitToFunctions(new InstructionRTN().write());
    }
}