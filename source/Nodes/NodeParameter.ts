import Node from "./Node";
import NodeIdentifier from "./NodeIdentifier";

export default class NodeParameter extends Node
{
    public readonly type_name: string;
    public readonly name: string;
}