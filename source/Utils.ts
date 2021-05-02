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
    public static getType(node: Node, typeName: string, qualifier: Qualifier, scope: Scope): Type
    {
        let type: Type;

        switch (typeName)
        {
            case "int":
                type = new TypeInteger(qualifier);
                break;

            case "uint":
                type = new TypeUnsignedInteger(qualifier);
                break;

            case "float":
                type = new TypeFloat(qualifier);
                break;

            default:
            {
                const struct = scope.getStructByName(typeName);

                if (struct)
                {
                    type = new TypeStruct(qualifier, struct.name, struct.members);
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

    public static getQualifer(node: Node, qualifierName: string): Qualifier
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