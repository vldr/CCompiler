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
import Node from "../Nodes/Node";
import NodeDeclarator from "../Nodes/NodeDeclarator";
import Variable from "../Variables/Variable";
import VariablePrimitive from "../Variables/VariablePrimitive";
import VariableStruct from "../Variables/VariableStruct";
import TypeVoid from "../Types/TypeVoid";

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

        declaratorsNode.forEach((declaratorNode) =>
        {
            const identifierNode = declaratorNode.name;
            const variableName = identifierNode.name;

            if (this._scope.getVariableByNameInScope(variableName) !== undefined)
            {
                throw ExternalErrors.VARIABLE_NAME_TAKEN(identifierNode, variableName);
            }

            //////////////////////////////////////////////

            const size = declaratorNode.arraySize?.value_base10 || 1;
            const initializerNode = declaratorNode.initializer;
            const initializerList = declaratorNode.initializer_list;

            if (declaratorNode.arraySize && declaratorNode.arraySize.value_base10 === 1)
            {
                throw ExternalErrors.ARRAY_MUST_BE_ATLEAST_TWO(declaratorNode);
            }

            if (size < 1)
            {
                throw ExternalErrors.ARRAY_TOO_SMALL(declaratorNode);
            }

            //////////////////////////////////////////////

            const type = Utils.getType(typeAttributeNode, typeName, size, qualifier, this._scope);
            let variable: Variable;

            if (type instanceof TypeStruct)
            {
                variable = new VariableStruct(variableName, type, this._scope, this._compiler);

                if (initializerNode)
                {
                    throw ExternalErrors.CANNOT_COPY_STRUCT(node);
                }
            }
            else
            {
                variable = new VariablePrimitive(variableName, type, this._scope, this._compiler);
            }

            if (initializerList)
            {
                if (type instanceof TypeStruct || variable instanceof VariableStruct)
                {
                    throw ExternalErrors.CANNOT_NO_STRUCT_ARRAY(node);
                }

                if (initializerList.length > type.size)
                {
                    throw ExternalErrors.INTI_LIST_INDEX_OUT_OF_BOUNDS(node, type.size, initializerList.length);
                }

                initializerList.forEach((item, index) =>
                {
                    const psuedoVariable = (variable as VariablePrimitive).getElement(index);

                    const expressionResult = this._compiler.generateExpression(
                        new DestinationVariable(psuedoVariable.type, psuedoVariable),
                        this._scope,
                        item
                    );

                    if (!expressionResult.type.equals(psuedoVariable.type))
                    {
                        throw ExternalErrors.CANNOT_CONVERT_TYPE(item, expressionResult.type.toString(), psuedoVariable.type.toString());
                    }

                    const data = expressionResult.write();

                    if (this._scope.isRoot)
                    {
                        this._compiler.emitToRoot(data);
                    }
                    else
                    {
                        this._compiler.emitToFunctions(data);
                    }
                })

            }
            else if (initializerNode)
            {
                const expressionResult = this._compiler.generateExpression(
                    new DestinationVariable(type, variable),
                    this._scope,
                    initializerNode
                );

                if (!expressionResult.type.equals(type))
                {
                    throw ExternalErrors.CANNOT_CONVERT_TYPE(node, type.toString(), expressionResult.type.toString());
                }

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

            this._scope.addVariable(
                variable
            );
        });
    }
}