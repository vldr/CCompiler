import Statement from "./Statement";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import DestinationNone from "../Destinations/DestinationNone";
import NodeFunctionCall from "../Nodes/NodeFunctionCall";

export default class StatementRootFunctionCall extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeFunctionCall;

        const expressionResult = this._compiler.generateExpression(
            new DestinationNone(new TypeVoid(new QualifierNone(), 0)),
            this._scope,
            node
        );

        this._compiler.emitToRoot(expressionResult.write());
    }
}