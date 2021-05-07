import Type from "./Type";

export default class TypeFloat extends Type
{
    public toString(): string
    {
        return "float" + (this.size > 1 ? `[${this.size}]` : String());;
    }

    public clone(size: number): Type
    {
        return new TypeFloat(this.qualifer, size);
    }
}