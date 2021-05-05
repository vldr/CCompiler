import Node from "./Node";
import NodeOperator from "./NodeOperator";

export default class NodeScope extends Node
{
    public readonly statements: Node[];
}