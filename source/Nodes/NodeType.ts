import Node from "./Node";

export default class NodeType extends Node
{
    public readonly name: string;
    public readonly qualifier?: string;
}