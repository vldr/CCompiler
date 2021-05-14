import NodeLocation from "../Nodes/NodeLocation";
import Symbol from "./Symbol";

export default class SymbolStruct extends Symbol
{
    constructor(location: NodeLocation)
    {
        super("struct", location);
    }
}