import Type from "./Type";

export default class Array extends Type
{
    constructor(private _type: Type, private _size?: number)
    {
        super("array");
    }

    get type(): Type { return this._type; }
    get size(): number | undefined { return this._size; }
    get isPointer(): boolean { return this._size === undefined; }
}