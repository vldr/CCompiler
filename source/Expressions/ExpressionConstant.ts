import Expression from "./Expression";
import Destination from "../Destinations/Destination";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResultConstant from "./ExpressionResultConstant";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeFloat from "../Types/TypeFloat";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class ExpressionConstant extends Expression
{
    generate(): ExpressionResult
    {
        //type: Type, expression: ExpressionConstant, public readonly value: string

        const node = this._node;
        const destinationType = this._destination.type;

        let sourceType: Type;
        switch (node.type)
        {
            case "int":
                sourceType = new TypeInteger();

                break;
            case "float":
                sourceType = new TypeFloat();
                break;
            case "uint":
                sourceType = new TypeUnsignedInteger();
                break;
            default:
                throw InternalErrors.generateError("Unknown constant type.");
        }

        this._compiler.log(node);

        //const expressionResult = new ExpressionResultConstant();

        return new ExpressionResultConstant(new TypeInteger(), this, "0");
    }

    write(): string
    {
        return "";
    }
}