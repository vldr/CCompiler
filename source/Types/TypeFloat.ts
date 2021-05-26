import Type from "./Type";

export default class TypeFloat extends Type
{
    public toString(): string
    {
        return "float" + (this.arraySize > 0 ? `[${this.arraySize}]` : String());
    }

    public cloneSingular(): Type
    {
        return new TypeFloat(this.qualifer, 0);
    }
}