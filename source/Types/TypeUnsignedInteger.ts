import Type from "./Type";

export default class TypeUnsignedInteger extends Type
{
    public toString(): string
    {
        return "uint" + (this.size > 1 ? `[${this.size}]` : String());;
    }
}