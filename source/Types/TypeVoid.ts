import Type from "./Type";

export default class TypeVoid extends Type
{
    public toString(): string
    {
        return "void";
    }

    public cloneSingular(): Type
    {
        return new TypeVoid(this.qualifer, 0);
    }
}