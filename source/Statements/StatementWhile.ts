import Statement from "./Statement";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJNA from "../Instructions/InstructionJNA";
import NodeScope from "../Nodes/NodeScope";
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";
import Scope from "../Scope";
import Function from "../Function";
import NodeWhileStatement from "../Nodes/NodeWhileStatement";
import Loop from "../Loop";

export default class StatementWhile extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeWhileStatement;

        const condition = node.condition;
        const body = node.body;

        if (body.type === "declarator")
        {
            throw ExternalErrors.CANNOT_DECLARE_VAR_HERE(body);
        }

        /////////////////////////////////////////////////////////

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const statementName = `while_loop_${substatementIndex}`;
        const startLabel = `${this._scope.name}_${statementName}`
        const finishLabel = `${this._scope.name}_${statementName}_finish`

        const expressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)),
            this._scope,
            condition
        );

        if (!expressionResult.type.equals(new TypeInteger(new QualifierNone(), 0))
            && !expressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 0)))
        {
            throw ExternalErrors.CANNOT_CONVERT_TYPE(condition, expressionResult.type.toString(), "int | uint");
        }

        this._compiler.emitToFunctions(new InstructionLabel(startLabel).write());
        this._compiler.emitToFunctions(expressionResult.write());
        this._compiler.emitToFunctions(new InstructionJNA(finishLabel).write());

        this.generateBody(startLabel, finishLabel, statementName, node.body);

        this._compiler.emitToFunctions(new InstructionJMP(startLabel).write());
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