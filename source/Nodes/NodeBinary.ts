import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeBinary extends Node
{
    public readonly operator: NodeOperator;
    public readonly left: Node;
    public readonly right: Node;
}