import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeUnary extends Node
{
    public readonly operator: NodeOperator;
    public readonly expression: Node;
}