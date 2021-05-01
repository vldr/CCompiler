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
import Variable from "../Variable";
import QualifierNone from "../Qualifiers/QualifierNone";
import DestinationVariable from "../Destinations/DestinationVariable";

export default class StatementDeclarator extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node;
        const typeAttributeNode = node.typeAttribute;
        const declaratorsNode = node.declarators;

        if (typeAttributeNode === undefined || declaratorsNode === undefined)
            throw InternalErrors.generateError("Invalid declarator provided.");

        const typeName = typeAttributeNode.name;
        const typeQualifier = typeAttributeNode.qualifier;

        //////////////////////////////////////////////

        let qualifier = new QualifierNone();

        if (typeQualifier)
        {
            switch (typeQualifier)
            {
                case "const":
                    qualifier = new QualifierConst();
                    break;
                default:
                    throw ExternalErrors.UNKNOWN_QUALIFIER(typeQualifier, typeAttributeNode);
            }
        }

        //////////////////////////////////////////////

        let type: Type;

        switch (typeName)
        {
            case "int":
                type = new TypeInteger();
                break;

            case "uint":
                type = new TypeUnsignedInteger();
                break;

            case "float":
                type = new TypeFloat();
                break;

            default:
            {
                const struct = this._scope.getStructByName(typeName);

                if (struct)
                {
                    type = struct;
                }
                else
                {
                    throw ExternalErrors.UNKNOWN_TYPE(typeName, typeAttributeNode);
                }

                break;
            }
        }

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

            const variable = new Variable(variableName, type, this._scope, qualifier, size);

            this._scope.addVariable(
                variable
            );

            //////////////////////////////////////////////

            if (initializerNode)
            {
                const expressionResult = this._compiler.generateExpression(
                    new DestinationVariable(type, variable),
                    this._scope,
                    initializerNode
                );
            }
            else if (qualifier instanceof QualifierConst)
            {
                throw ExternalErrors.CONST_VARIABLES_MUST_BE_INIT(node);
            }
        });

        // this._compiler.log(type);
        // this._compiler.log(qualifier);
        // this._compiler.log(node);
    }
}