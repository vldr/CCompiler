import Type from "../Types/Type";

export default abstract class Destination
{
    constructor(private _type: Type)
    {
    }

    get type()
    {
        return this._type;
    }
}