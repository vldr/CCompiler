import Statement from "./Statement";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import DestinationNone from "../Destinations/DestinationNone";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJNA from "../Instructions/InstructionJNA";
import NodeScope from "../Nodes/NodeScope";
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";
import Scope from "../Scope";
import NodeForStatement from "../Nodes/NodeForStatement";
import Loop from "../Loop";

export default class StatementFor extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeForStatement;

        const condition = node.condition;
        const initializer = node.initializer;
        const increment = node.increment;
        const body = node.body;

        if (body.type === "declarator")
        {
            throw ExternalErrors.CANNOT_DECLARE_VAR_HERE(body);
        }

        /////////////////////////////////////////////////////////

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const statementName = `for_loop_${substatementIndex}`;
        const startLabel = `${this._scope.name}_${statementName}`;
        const finishLabel = `${this._scope.name}_${statementName}_finish`;
        const incrementLabel = `${this._scope.name}_${statementName}_increment`;

        const newScope = new Scope(this._compiler, "_" + statementName, this._scope);
        newScope.setLoop(new Loop(incrementLabel, finishLabel));

        this._compiler.addScope(newScope);

        if (initializer)
        {
            this._compiler.generateAndEmitStatement(
                newScope,
                initializer
            );
        }

        this._compiler.emitToFunctions(new InstructionLabel(startLabel).write());

        if (condition)
        {
            const conditionalExpressionResult = this._compiler.generateExpression(
                new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)),
                newScope,
                condition
            );

            if (!conditionalExpressionResult.type.equals(new TypeInteger(new QualifierNone(), 0))
                && !conditionalExpressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 0)))
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(condition, conditionalExpressionResult.type.toString(), "int | uint");
            }

            this._compiler.emitToFunctions(conditionalExpressionResult.write());
            this._compiler.emitToFunctions(new InstructionJNA(finishLabel).write());
        }

        this.generateBody(statementName, newScope, node.body);

        this._compiler.emitToFunctions(new InstructionLabel(incrementLabel).write());
        if (increment)
        {
            const incrementExpressionResult = this._compiler.generateExpression(
                new DestinationNone(new TypeVoid(new QualifierNone(), 0)),
                newScope,
                increment
            );

            this._compiler.emitToFunctions(incrementExpressionResult.write());
        }

        this._compiler.emitToFunctions(new InstructionJMP(startLabel).write());
        this._compiler.emitToFunctions(new InstructionLabel(finishLabel).write());
    }

    private generateBody(statementName: string, newScope: Scope, body: Node)
    {
        if (body.type === "scope")
        {
            const scopeNode = body as NodeScope;

            scopeNode.statements.forEach((statement) =>
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