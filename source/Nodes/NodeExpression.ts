import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeExpression extends Node
{
    public readonly expression: Node | null;
}