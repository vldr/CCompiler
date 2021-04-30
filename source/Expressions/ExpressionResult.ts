import Type from "../Types/Type";

export default class ExpressionResult
{
    constructor(private _type: Type)
    {
    }

    get type() { return this._type }
}