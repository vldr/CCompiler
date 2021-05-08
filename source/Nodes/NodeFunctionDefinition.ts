import Node from "./Node";
import NodeType from "./NodeType";
import NodeParameter from "./NodeParameter";
import NodeScope from "./NodeScope";

export default class NodeFunctionDefinition extends Node
{
    public readonly name: string;
    public readonly returnType: NodeType;
    public readonly parameters: NodeParameter[];
    public readonly body: NodeScope;
}