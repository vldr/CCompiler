import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeWhileStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
}