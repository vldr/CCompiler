import Node from "./Node";
import NodeDeclarator from "./NodeDeclarator";

export default class NodeStructDefinition extends Node
{
    public readonly qualifier?: string;
    public readonly name?: string;
    public readonly members: NodeDeclarator[];
}