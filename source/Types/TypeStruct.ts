import Type from "./Type";

export default class TypeStruct extends Type
{
    constructor(private _name: string, private _members: Map<string, Type>)
    {
        super();
    }

    get members(): Map<string, Type> { return this.members; }
    get name() { return this._name }
}