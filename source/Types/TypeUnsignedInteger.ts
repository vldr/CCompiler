import Type from "./Type";

export default class TypeUnsignedInteger extends Type
{
    public toString(): string
    {
        return "uint";
    }

    public equals(type: Type): boolean
    {
        return type.constructor === this.constructor;
    }
}