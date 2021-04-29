import Type from "./Type";

export default class Struct extends Type
{
    constructor(name: string, private _members: Map<string, Type>)
    {
        super(name);
    }

    get members(): Map<string, Type> { return this.members; }
}