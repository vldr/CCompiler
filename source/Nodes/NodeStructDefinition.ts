import Node from "./Node";
import NodeDeclarator from "./NodeDeclarator";
import NodeLocation from "./NodeLocation";
import NodeIdentifier from "./NodeIdentifier";

export default class NodeStructDefinition extends Node
{
    public readonly qualifier?: string;
    public readonly name?: string;
    public readonly identifier?: NodeIdentifier;
    public readonly members: NodeDeclarator[];
}