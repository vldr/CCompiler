import NodeLocation from "../Nodes/NodeLocation";
import Symbol from "./Symbol";

export default class SymbolStructMember extends Symbol
{
    constructor(location: NodeLocation)
    {
        super("structMember", location);
    }
}