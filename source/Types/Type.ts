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
    public abstract equals(type: Type): boolean;

    get isConstant()  { return this.qualifer instanceof QualifierConst; }
}