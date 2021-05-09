import Node from "./Node";
import NodeConstant from "./NodeConstant";

export default class NodeFunctionCall extends Node
{
    public readonly function_name: string;
    public readonly parameters: Node[];
}