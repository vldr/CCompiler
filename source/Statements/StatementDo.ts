import Statement from "./Statement";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import InstructionLabel from "../Instructions/InstructionLabel";
import NodeScope from "../Nodes/NodeScope";
import Node from "../Nodes/Node";
import Scope from "../Scope";
import NodeDoStatement from "../Nodes/NodeDoStatement";
import InstructionJA from "../Instructions/InstructionJA";
import Loop from "../Loop";

export default class StatementDo extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeDoStatement;

        const condition = node.condition;
        const body = node.body;

        if (body.type === "declarator")
        {
            throw ExternalErrors.CANNOT_DECLARE_VAR_HERE(body);
        }

        /////////////////////////////////////////////////////////

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const statementName = `do_loop_${substatementIndex}`;
        const startLabel = `${this._scope.name}_${statementName}`
        const finishLabel = `${this._scope.name}_${statementName}_finish`

        const conditionExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)),
            this._scope,
            condition
        );

        if (!conditionExpressionResult.type.equals(new TypeInteger(new QualifierNone(), 0))
            && !conditionExpressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 0)))
        {
            throw ExternalErrors.CANNOT_CONVERT_TYPE(condition, conditionExpressionResult.type.toString(), "int | uint");
        }

        this._compiler.emitToFunctions(new InstructionLabel(startLabel).write());

        this.generateBody(startLabel, finishLabel, statementName, node.body);

        this._compiler.emitToFunctions(conditionExpressionResult.write());
        this._compiler.emitToFunctions(new InstructionJA(startLabel).write());
        this._compiler.emitToFunctions(new InstructionLabel(finishLabel).write());
    }

    private generateBody(startLabel: string, finishLabel: string, statementName: string, body: Node)
    {
        const newScope = new Scope(this._compiler, "_" + statementName, this._scope);
        newScope.setLoop(new Loop(startLabel, finishLabel));

        this._compiler.addScope(newScope);

        if (body.type === "scope")
        {
            (body as NodeScope).statements.forEach((statement) =>
            {
                this._compiler.generateAndEmitStatement(
                    newScope,
                    statement
                );
            });
        }
        else
        {
            this._compiler.generateAndEmitStatement(
                newScope,
                body
            );
        }
    }
}