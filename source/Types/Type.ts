import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";

export default abstract class Type
{
    constructor(
        public readonly qualifer: Qualifier,
        public readonly arraySize: number
    )
    {
    }

    public abstract toString(): string;
    public abstract cloneSingular(): Type;

    public equals(type: Type): boolean
    {
        return type.constructor === this.constructor && type.arraySize === this.arraySize;
    }

    get isConstant()  { return this.qualifer instanceof QualifierConst; }
}