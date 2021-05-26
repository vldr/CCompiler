import Type from "./Type";
import Qualifier from "../Qualifiers/Qualifier";

export default class TypeStruct extends Type
{
    constructor(
        qualifer: Qualifier,
        public readonly name: string,
        size: number,
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

    public cloneSingular(): Type
    {
        return new TypeStruct(this.qualifer, this.name, 0, this.members);
    }

    public toString(): string
    {
        return this.name + (this.arraySize > 0 ? `[${this.arraySize}]` : String());
    }
}