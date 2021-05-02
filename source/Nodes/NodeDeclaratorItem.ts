import Node from "./Node";
import NodeIdentifier from "./NodeIdentifier";

export default class NodeDeclaratorItem extends Node
{
    public readonly name: NodeIdentifier;
    public readonly initializer?: Node;
    public readonly arraySize?: number;
    public readonly isArray?: boolean;
}