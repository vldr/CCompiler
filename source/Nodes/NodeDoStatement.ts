import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeDoStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
}