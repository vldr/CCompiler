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
import NodeStructDefinition from "../Nodes/NodeStructDefinition";

export default class StatementStructDefinition extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeStructDefinition;

        this._compiler.log(node);

        if (!node.name)
            throw ExternalErrors.STRUCT_MUST_BE_NAMED(node);

        const nameStruct = node.name;
        const qualifierStruct = Utils.getQualifer(node, node.qualifier);

        if (this._scope.getVariableByName(nameStruct) !== undefined ||
            this._scope.getFunctionByName(nameStruct) !== undefined ||
            this._scope.getStructByName(nameStruct) !== undefined
        )
        {
            throw ExternalErrors.VARIABLE_NAME_TAKEN(node, nameStruct);
        }

        //////////////////////////////////////////////////////////////////

        let members = new Map<string, Type>();

        node.members.forEach((nodeDeclarator) =>
        {
            const typeAttributeNode = nodeDeclarator.typeAttribute;
            const declaratorsNode = nodeDeclarator.declarators;
            const typeName = typeAttributeNode.name;
            const qualifierName = typeAttributeNode.qualifier;

            //////////////////////////////////////////////

            let qualifier = Utils.getQualifer(typeAttributeNode, qualifierName);

            //////////////////////////////////////////////

            declaratorsNode.forEach((declaratorNode: any) =>
            {
                const identifierNode = declaratorNode.name;
                const variableName = identifierNode.name;

                if (members.has(variableName))
                {
                    throw ExternalErrors.VARIABLE_NAME_TAKEN(variableName, identifierNode);
                }

                //////////////////////////////////////////////

                const arraySizeNode = declaratorNode.arraySize;
                const size = arraySizeNode?.value_base10 || 1;

                if (size < 1)
                {
                    throw ExternalErrors.ARRAY_TOO_SMALL(arraySizeNode);
                }

                //////////////////////////////////////////////

                let type = Utils.getType(typeAttributeNode, typeName, size, qualifier, this._scope);

                members.set(variableName, type);
            });
        });

        this._scope.addStruct(new TypeStruct(qualifierStruct, nameStruct, 1, members))
    }
}