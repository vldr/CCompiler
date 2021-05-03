import Type from "./Type";

export default class TypeInteger extends Type
{
    public toString(): string
    {
        return "int";
    }

    public equals(type: Type): boolean
    {
        return type.constructor === this.constructor;
    }
}