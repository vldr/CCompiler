import Type from "./Type";

export default class TypeFloat extends Type
{
    public toString(): string
    {
        return "float";
    }

    public equals(type: Type): boolean
    {
        return type.constructor === this.constructor;
    }
}