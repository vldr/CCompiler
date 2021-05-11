import Node from "./Node";

export default class NodeTypeCast extends Node
{
    public readonly cast_to: string;
    public readonly expression: Node;
}