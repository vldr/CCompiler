export default abstract class Type
{
    private _name: string

    protected constructor(name: string) {
        this._name = name;
    }

    get name()
    {
        return this._name;
    }
}