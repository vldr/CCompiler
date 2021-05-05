import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";

export default abstract class Type
{
    constructor(
        public readonly qualifer: Qualifier,
        public readonly size: number
    )
    {
    }

    public abstract toString(): string;

    public equals(type: Type): boolean
    {
        return type.constructor === this.constructor && type.size === this.size;
    }

    get isConstant()  { return this.qualifer instanceof QualifierConst; }
}