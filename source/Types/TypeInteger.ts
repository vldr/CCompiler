import Type from "./Type";

export default class TypeInteger extends Type
{
    public toString(): string
    {
        return "int" + (this.size > 1 ? `[${this.size}]` : String());
    }
}