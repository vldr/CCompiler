import Type from "./Type";
import Variable from "../Variable";

export default class TypeStruct extends Type
{
    constructor(
        public readonly name: string,
        public readonly members: Map<string, Type>,
        private _variable: Variable
    )
    {
        super();
    }

    public getTypeByMemberName(name: string)
    {
        return this.members.get(name);
    }

    public getLabelByMemberName(name: string)
    {
        if (this.members.has(name))
        {
            return `${this._variable.labelName}__${name}`;
        }

        return undefined;
    }

    public toString(): string
    {
        return this.name;
    }
}