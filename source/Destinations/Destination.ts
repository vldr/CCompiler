import Type from "../Types/Type";

export default abstract class Destination
{
    constructor(public readonly type: Type)
    {
    }
}