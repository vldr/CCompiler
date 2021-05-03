import Type from "./Type";
import Qualifier from "../Qualifiers/Qualifier";

export default class TypeStruct extends Type
{
    constructor(
        qualifer: Qualifier,
        public readonly name: string,
        public readonly size: number,
        public readonly members: Map<string, Type>,
    )
    {
        super(qualifer, size);
    }

    public equals(type: Type): boolean
    {
        if (type instanceof TypeStruct)
        {
            const otherStruct: TypeStruct = type;
            otherStruct.members.forEach((type, name) =>
            {
                const ourType = this.members.get(name);
                if (ourType === undefined || !ourType.equals(type))
                {
                    return false;
                }
            })

            return true;
        }
        else
        {
            return false;
        }

    }

    public toString(): string
    {
        return this.name;
    }
}