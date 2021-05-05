import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodePostfix extends Node
{
    public readonly operator: Node;
    public readonly expression: Node;
}