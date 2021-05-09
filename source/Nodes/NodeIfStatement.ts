import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeIfStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
    public readonly elseBody?: Node;
}