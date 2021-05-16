import NodeLocation from "../Nodes/NodeLocation";
import Symbol from "./Symbol";

export default class SymbolAccessor extends Symbol
{
    constructor(location: NodeLocation)
    {
        super("accessor", location);
    }
}