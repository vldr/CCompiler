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

export default class StatementDeclarator extends Statement
{
    private _generatedCode: Array<Instruction>;

    public generate(): void
    {
        const node = this._node;
        const typeAttribute = node.typeAttribute;
        const declarators = node.declarators;

        if (typeAttribute === undefined || declarators === undefined)
            throw new Error("Internal error: Invalid declarator provided.");

        const typeName = typeAttribute.name;
        const typeQualifier = typeAttribute.qualifier;

        //////////////////////////////////////////////

        let qualifier: Qualifier | undefined;

        if (typeQualifier)
        {
            switch (typeQualifier)
            {
                case "const":
                    qualifier = new QualifierConst();
                    break;
                default:
                    throw ExternalErrors.UNKNOWN_QUALIFIER(typeQualifier, typeAttribute);
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
                    throw ExternalErrors.UNKNOWN_TYPE(typeName, typeAttribute);
                }

                break;
            }
        }

        //////////////////////////////////////////////

        declarators.forEach((item: any) =>
        {

        });

        this._compiler.log(type);
        this._compiler.log(qualifier);
        this._compiler.log(node);
    }

    public emit()
    {
        this._generatedCode.forEach((instruction) => {
            super._compiler.emitToRoot(instruction)
        });
    }

}