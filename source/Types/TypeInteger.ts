import Type from "./Type";

export default class TypeInteger extends Type
{
    public toString(): string
    {
        return "int" + (this.arraySize > 0 ? `[${this.arraySize}]` : String());
    }

    public cloneSingular(): Type
    {
        return new TypeInteger(this.qualifer, 0);
    }
}