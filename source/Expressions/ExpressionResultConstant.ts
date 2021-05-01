import Type from "../Types/Type";
import ExpressionResult from "./ExpressionResult";
import ExpressionConstant from "./ExpressionConstant";

export default class ExpressionResultConstant extends ExpressionResult
{
    constructor(type: Type, expression: ExpressionConstant, public readonly value: string)
    {
        super(type, expression);
    }
}