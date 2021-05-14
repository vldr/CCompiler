import NodeLocation from "../Nodes/NodeLocation";
import Symbol from "./Symbol";

export default class SymbolFunction extends Symbol
{
    constructor(location: NodeLocation)
    {
        super("func", location);
    }
}