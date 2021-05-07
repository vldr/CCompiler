import Type from "./Type";

export default class TypeInteger extends Type
{
    public toString(): string
    {
        return "int" + (this.size > 1 ? `[${this.size}]` : String());
    }

    public clone(size: number): Type
    {
        return new TypeInteger(this.qualifer, size);
    }
}