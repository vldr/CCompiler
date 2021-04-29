export default abstract class Type
{
    protected constructor(private _name: string)
    {
    }

    get name()
    {
        return this._name;
    }
}