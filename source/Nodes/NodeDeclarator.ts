import Node from "./Node";
import NodeType from "./NodeType";
import NodeDeclaratorItem from "./NodeDeclaratorItem";

export default class NodeDeclarator extends Node
{
    public readonly typeAttribute: NodeType;
    public readonly declarators: NodeDeclaratorItem[];
}