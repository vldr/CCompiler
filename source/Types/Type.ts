import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";

export default abstract class Type
{
    constructor(public readonly qualifer: Qualifier)
    {
    }

    public abstract toString(): string;

    get isConstant()
    {
        return this.qualifer instanceof QualifierConst;
    }
}