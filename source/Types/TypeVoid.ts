import Type from "./Type";

export default class TypeVoid extends Type
{
    public toString(): string
    {
        return "void";
    }

    public clone(size: number): Type
    {
        return new TypeVoid(this.qualifer, size);
    }
}