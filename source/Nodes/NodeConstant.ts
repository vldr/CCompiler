import Node from "./Node";

export default class NodeConstant extends Node
{
    public readonly value_base10: number;
    public readonly value: string;
    public readonly format?: string;

}