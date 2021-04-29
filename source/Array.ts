import Type from "./Type";

export default class Array extends Type
{
    private _size: number | undefined;
    private _type: Type;

    constructor(name: string, type: Type, size?: number)
    {
        super(name);

        this._type = type;
        this._size = size;
    }

    get type(): Type { return this._type; }
    get size(): number | undefined { return this._size; }
    get isPointer(): boolean { return this._size === undefined; }
}