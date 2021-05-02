import NodeLocation from "../Nodes/NodeLocation";

export default class CompilerError
{
    constructor(
        public readonly message: string,
        public readonly location: NodeLocation,
    )
    {
    }
}
