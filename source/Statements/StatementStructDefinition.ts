import Statement from "./Statement";
import Type from "../Types/Type";
import ExternalErrors from "../Errors/ExternalErrors";
import TypeStruct from "../Types/TypeStruct";
import Utils from "../Utils";
import NodeStructDefinition from "../Nodes/NodeStructDefinition";
import SymbolStruct from "../Symbols/SymbolStruct";

export default class StatementStructDefinition extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeStructDefinition;

        if (!node.name)
            throw ExternalErrors.STRUCT_MUST_BE_NAMED(node);

        const nameStruct = node.name;
        const identifierStructNode = node.identifier;
        const qualifierStruct = Utils.getQualifer(node, node.qualifier);

        if (this._scope.getVariableByName(nameStruct) !== undefined ||
            this._scope.getFunctionByName(nameStruct) !== undefined ||
            this._scope.getStructByName(nameStruct) !== undefined
        )
        {
            throw ExternalErrors.VARIABLE_NAME_TAKEN(node, nameStruct);
        }

        //////////////////////////////////////////////////////////////////

        if (identifierStructNode)
            this._compiler.addSymbol(new SymbolStruct(identifierStructNode.location));

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
                const size = arraySizeNode?.value_base10 || 0;

                if (arraySizeNode && arraySizeNode.value_base10 <= 0)
                    throw ExternalErrors.ARRAY_MUST_BE_ATLEAST_ONE(declaratorNode);

                //////////////////////////////////////////////

                let type = Utils.getType(typeAttributeNode, typeName, size, qualifier, this._scope);

                if (type instanceof TypeStruct)
                {
                    this._compiler.addSymbol(new SymbolStruct(typeAttributeNode.location));
                }

                members.set(variableName, type);
            });
        });

        this._scope.addStruct(new TypeStruct(qualifierStruct, nameStruct, 1, members))
    }
}