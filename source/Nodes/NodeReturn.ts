import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeReturn extends Node
{
    public readonly value?: Node;
}