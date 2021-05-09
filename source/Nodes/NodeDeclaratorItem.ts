import Node from "./Node";
import NodeIdentifier from "./NodeIdentifier";
import NodeConstant from "./NodeConstant";

export default class NodeDeclaratorItem extends Node
{
    public readonly name: NodeIdentifier;
    public readonly initializer?: Node;
    public readonly initializer_list?: Node[];
    public readonly arraySize?: NodeConstant;
    public readonly isArray?: boolean;
}