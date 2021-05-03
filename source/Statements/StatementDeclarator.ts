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

export default class StatementDeclarator extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeDeclarator;

        const typeAttributeNode = node.typeAttribute;
        const declaratorsNode = node.declarators;
        const typeName = typeAttributeNode.name;
        const qualifierName = typeAttributeNode.qualifier;

        //////////////////////////////////////////////

        let qualifier = Utils.getQualifer(typeAttributeNode, qualifierName);

        //////////////////////////////////////////////

        declaratorsNode.forEach((declaratorNode: any) =>
        {
            const identifierNode = declaratorNode.name;
            const variableName = identifierNode.name;

            if (this._scope.getVariableByName(variableName) !== undefined ||
                this._scope.getStructByName(variableName) !== undefined)
            {
                throw ExternalErrors.VARIABLE_NAME_TAKEN(variableName, identifierNode);
            }

            //////////////////////////////////////////////

            const arraySizeNode = declaratorNode.arraySize;
            const initializerNode = declaratorNode.initializer;
            const size = arraySizeNode?.value_base10 || 1;

            if (size < 1)
            {
                throw ExternalErrors.ARRAY_TOO_SMALL(arraySizeNode);
            }

            //////////////////////////////////////////////

            const type = Utils.getType(typeAttributeNode, typeName, size, qualifier, this._scope);
            let variable: Variable;

            if (type instanceof TypeStruct)
            {
                variable = new VariableStruct(variableName, type, this._scope, this._compiler);
            }
            else
            {
                variable = new VariablePrimitive(variableName, type, this._scope, this._compiler);
            }

            this._scope.addVariable(
                variable
            );

            if (initializerNode)
            {
                const expressionResult = this._compiler.generateExpression(
                    new DestinationVariable(type, variable),
                    this._scope,
                    initializerNode
                );

                const data = expressionResult.write();

                if (this._scope.isRoot)
                {
                    this._compiler.emitToRoot(data);
                }
                else
                {
                    this._compiler.emitToFunctions(data);
                }
            }
            else if (qualifier instanceof QualifierConst)
            {
                throw ExternalErrors.CONST_VARIABLES_MUST_BE_INIT(node);
            }
        });
    }
}