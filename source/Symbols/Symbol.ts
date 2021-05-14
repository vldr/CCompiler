import NodeLocation from "../Nodes/NodeLocation";

export default abstract class Symbol
{
    constructor(public readonly className: string, public readonly location: NodeLocation)
    {
    }
}