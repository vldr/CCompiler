import NodeLocation from "../Nodes/NodeLocation";

export default class CompilerMessage
{
    constructor(
        public readonly messageId: string,
        public readonly message: string,
        public readonly location: NodeLocation,
    )
    {
    }
}
