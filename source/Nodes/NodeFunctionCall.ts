import Node from "./Node";
import NodeConstant from "./NodeConstant";
import NodeIdentifier from "./NodeIdentifier";

export default class NodeFunctionCall extends Node
{
    public readonly function_name: string;
    public readonly identifier: NodeIdentifier;
    public readonly parameters: Node[];
}