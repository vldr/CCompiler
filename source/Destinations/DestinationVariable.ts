import Destination from "./Destination";
import Variable from "../Variable";

export default class DestinationVariable extends Destination
{
    private _variable: Variable;

    constructor(variable: Variable)
    {
        super();
        this._variable = variable;
    }

    get variable()
    {
        return this._variable;
    }
}