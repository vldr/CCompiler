import Qualifier from "./Qualifiers/Qualifier";
import Type from "./Types/Type";
import TypeInteger from "./Types/TypeInteger";
import TypeUnsignedInteger from "./Types/TypeUnsignedInteger";
import TypeFloat from "./Types/TypeFloat";
import TypeStruct from "./Types/TypeStruct";
import ExternalErrors from "./Errors/ExternalErrors";
import Scope from "./Scope";
import QualifierNone from "./Qualifiers/QualifierNone";
import QualifierConst from "./Qualifiers/QualifierConst";
import Node from "./Nodes/Node"

export default class Utils
{
    public static isInlinable(type: Type, value: number): boolean
    {
        let result = false;

        if (type.arraySize <= 0)
        {
            if (type instanceof TypeInteger || type instanceof TypeUnsignedInteger)
            {
                if (Number.isInteger(value) && value >= 0 && value <= 4095)
                {
                    result = true;
                }
            }
        }

        return result;
    }

    public static isSingleOperand(node: Node)
    {
        return (node.type === "identifier" || node.type === "int" || node.type === "float" || node.type === "uint");
    }

    public static getType(node: Node, typeName: string, size: number, qualifier: Qualifier, scope: Scope): Type
    {
        let type: Type;

        switch (typeName)
        {
            case "int":
                type = new TypeInteger(qualifier, size);
                break;

            case "uint":
                type = new TypeUnsignedInteger(qualifier, size);
                break;

            case "float":
                type = new TypeFloat(qualifier, size);
                break;

            default:
            {
                const struct = scope.getStructByName(typeName);

                if (struct)
                {
                    type = new TypeStruct(qualifier, struct.name, size, struct.members);
                }
                else
                {
                    throw ExternalErrors.UNKNOWN_TYPE(node, typeName);
                }

                break;
            }
        }

        return type;
    }

    public static getQualifer(node: Node, qualifierName?: string): Qualifier
    {
        let qualifier = new QualifierNone();

        if (qualifierName)
        {
            switch (qualifierName)
            {
                case "const":
                    qualifier = new QualifierConst();
                    break;
                default:
                    throw ExternalErrors.UNKNOWN_QUALIFIER(node, qualifierName);
            }
        }

        return qualifier;
    }
}