import Statement from "./Statement";
import Type from "../Types/Type";
import ExternalErrors from "../Errors/ExternalErrors";
import TypeStruct from "../Types/TypeStruct";
import Utils from "../Utils";
import NodeStructDefinition from "../Nodes/NodeStructDefinition";
import SymbolStruct from "../Symbols/SymbolStruct";
import DestinationNone from "../Destinations/DestinationNone";
import TypeVoid from "../Types/TypeVoid";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExpressionResultConstant from "../Expressions/ExpressionResultConstant";

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

                let size = 0;

                if (declaratorNode.arraySize)
                {
                    const arraySizeExpression = this._compiler.generateExpression(
                        new DestinationNone(new TypeVoid(new QualifierNone(), 0)),
                        this._scope,
                        declaratorNode.arraySize
                    );

                    if (!(arraySizeExpression.type instanceof TypeInteger) && !(arraySizeExpression.type instanceof TypeUnsignedInteger))
                        throw ExternalErrors.ARRAY_SIZE_MUST_BE_INT_OR_UINT(declaratorNode);

                    if (!(arraySizeExpression instanceof ExpressionResultConstant))
                        throw ExternalErrors.ARRAY_SIZE_MUST_BE_CONSTANT(declaratorNode);

                    if (arraySizeExpression.value <= 0)
                        throw ExternalErrors.ARRAY_MUST_BE_ATLEAST_ONE(declaratorNode);

                    size = arraySizeExpression.value;
                }

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