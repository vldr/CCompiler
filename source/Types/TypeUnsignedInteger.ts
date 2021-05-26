import Type from "./Type";

export default class TypeUnsignedInteger extends Type
{
    public toString(): string
    {
        return "uint" + (this.arraySize > 0 ? `[${this.arraySize}]` : String());
    }

    public cloneSingular(): Type
    {
        return new TypeUnsignedInteger(this.qualifer, 0);
    }
}