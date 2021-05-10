import Node from "./Node";
import NodeDeclarator from "./NodeDeclarator";
import NodeLocation from "./NodeLocation";

export default class NodeStructDefinition extends Node
{
    public readonly qualifier?: string;
    public readonly name?: string;
    public readonly nameLocation?: NodeLocation;
    public readonly members: NodeDeclarator[];
}