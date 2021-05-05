import Type from "../Types/Type";
import Expression from "./Expression";
import Instruction from "../Instructions/Instruction";
import ExpressionResult from "./ExpressionResult";
import Variable from "../Variables/Variable";

export default class ExpressionResultVariable extends ExpressionResult
{
    constructor(
        type: Type,
        expression: Expression,
        public readonly variable: Variable
    )
    {
        super(type, expression)
    }


}