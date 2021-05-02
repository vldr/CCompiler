export default class NodeLocation
{
    public readonly start: {
        offset: number,
        line: number,
        column: number
    }

    public readonly end: {
        offset: number,
        line: number,
        column: number
    }
}