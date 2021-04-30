import Destination from "./Destination";
import Variable from "../Variable";
import Type from "../Types/Type";

export default class DestinationVariable extends Destination
{
    private _variable: Variable;

    constructor(type: Type, variable: Variable)
    {
        super(type);

        this._variable = variable;
    }

    get variable()
    {
        return this._variable;
    }
}