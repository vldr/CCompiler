import Node from "./Node";
import NodeIdentifier from "./NodeIdentifier";
import NodeConstant from "./NodeConstant";

export default class NodeParameter extends Node
{
    public readonly type_name: string;
    public readonly name: string;
    public readonly typeQualifier?: string;
    public readonly arraySize?: NodeConstant;
}