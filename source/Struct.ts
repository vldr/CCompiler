import Type from "./Type";

export default class Struct extends Type
{
    private _members: Map<string, Type>;

    constructor(name: string, members: Map<string, Type>)
    {
        super(name);

        this._members = members;
    }

    get members(): Map<string, Type> { return this.members; }
}