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

    public toString(): string
    {
        return this.name;
    }
}