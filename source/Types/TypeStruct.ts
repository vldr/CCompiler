import Type from "./Type";
import Variable from "../Variable";
import Qualifier from "../Qualifiers/Qualifier";

export default class TypeStruct extends Type
{
    constructor(
        qualifer: Qualifier,
        public readonly name: string,
        public readonly members: Map<string, Type>,
    )
    {
        super(qualifer);
    }

    public toString(): string
    {
        return this.name;
    }
}