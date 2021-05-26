import Statement from "./Statement";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import DestinationNone from "../Destinations/DestinationNone";
import NodeExpression from "../Nodes/NodeExpression";

export default class StatementExpression extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeExpression;

        if (node.expression)
        {
            const expressionResult = this._compiler.generateExpression(
                new DestinationNone(new TypeVoid(new QualifierNone(), 0)),
                this._scope,
                node.expression
            );

            this._compiler.emitToFunctions(expressionResult.write());
        }
    }
}