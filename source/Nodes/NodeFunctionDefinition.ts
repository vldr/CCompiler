import Node from "./Node";
import NodeType from "./NodeType";
import NodeParameter from "./NodeParameter";
import NodeScope from "./NodeScope";
import NodeLocation from "./NodeLocation";
import NodeIdentifier from "./NodeIdentifier";

export default class NodeFunctionDefinition extends Node
{
    public readonly name: string;
    public readonly identifier: NodeIdentifier;
    public readonly returnType: NodeType;
    public readonly parameters: NodeParameter[];
    public readonly body: NodeScope;
}