import Statement from "./Statement";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import TypeVoid from "../Types/TypeVoid";
import NodeIfStatement from "../Nodes/NodeIfStatement";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJNA from "../Instructions/InstructionJNA";
import NodeScope from "../Nodes/NodeScope";
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";
import Scope from "../Scope";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class StatementIf extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeIfStatement;
        const condition = node.condition;
        const body = node.body;
        const elseBody = node.elseBody;

        if (body.type === "declarator")
        {
            throw ExternalErrors.CANNOT_DECLARE_VAR_HERE(body);
        }

        if (elseBody && elseBody.type === "declarator")
        {
            throw ExternalErrors.CANNOT_DECLARE_VAR_HERE(elseBody);
        }

        /////////////////////////////////////////////////////////

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const statementName = `if_statement_${substatementIndex}`;
        const alternateLabel = `${this._scope.name}_${statementName}_alternate`;
        const finishLabel = `${this._scope.name}_${statementName}_finish`;

        const conditionalExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)),
            this._scope,
            condition
        );

        if (!conditionalExpressionResult.type.equals(new TypeInteger(new QualifierNone(), 0))
            && !conditionalExpressionResult.type.equals(new TypeUnsignedInteger(new QualifierNone(), 0)))
        {
            throw ExternalErrors.CANNOT_CONVERT_TYPE(condition, conditionalExpressionResult.type.toString(), "int | uint");
        }

        this._compiler.emitToFunctions(conditionalExpressionResult.write());
        this._compiler.emitToFunctions(new InstructionJNA(alternateLabel).write());

        this.generateBody(statementName, node.body);

        this._compiler.emitToFunctions(new InstructionJMP(finishLabel).write());
        this._compiler.emitToFunctions(new InstructionLabel(alternateLabel).write());

        if (elseBody)
        {
            this.generateBody(statementName + "_alternate", elseBody);
        }

        this._compiler.emitToFunctions(new InstructionLabel(finishLabel).write());
    }

    private generateBody(statementName: string, body: Node)
    {
        if (body.type === "scope")
        {
            const scopeNode = body as NodeScope;

            const newScope = new Scope(this._compiler, "_" + statementName, this._scope);
            this._compiler.addScope(newScope);

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
                this._scope,
                body
            );
        }
    }
}