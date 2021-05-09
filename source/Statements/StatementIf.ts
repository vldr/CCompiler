import Compiler from "../Compiler";
import Statement from "./Statement";
import Instruction from "../Instructions/Instruction";
import Type from "../Types/Type";
import TypeInteger from "../Types/TypeInteger";
import Qualifier from "../Qualifiers/Qualifier";
import QualifierConst from "../Qualifiers/QualifierConst";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import InternalErrors from "../Errors/InternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import DestinationVariable from "../Destinations/DestinationVariable";
import TypeStruct from "../Types/TypeStruct";
import Utils from "../Utils";
import NodeDeclarator from "../Nodes/NodeDeclarator";
import Variable from "../Variables/Variable";
import VariablePrimitive from "../Variables/VariablePrimitive";
import VariableStruct from "../Variables/VariableStruct";
import NodeReturn from "../Nodes/NodeReturn";
import TypeVoid from "../Types/TypeVoid";
import DestinationNone from "../Destinations/DestinationNone";
import DestinationStack from "../Destinations/DestinationStack";
import InstructionRTN from "../Instructions/InstructionRTN";
import ExpressionResultVariable from "../Expressions/ExpressionResultVariable";
import ExpressionResultAccessor from "../Expressions/ExpressionResultAccessor";
import NodeIfStatement from "../Nodes/NodeIfStatement";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import InstructionLabel from "../Instructions/InstructionLabel";
import InstructionJNA from "../Instructions/InstructionJNA";
import NodeScope from "../Nodes/NodeScope";
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";
import Scope from "../Scope";
import Function from "../Function";

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
        const alternateLabel = `${this._scope.name}_${statementName}_alternate`
        const finishLabel = `${this._scope.name}_${statementName}_finish`

        const expressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 1)),
            this._scope,
            condition
        );

        this._compiler.emitToFunctions(expressionResult.write());
        this._compiler.emitToFunctions(new InstructionJNA(alternateLabel).write());

        this.generateBody(statementName, node.body);

        this._compiler.emitToFunctions(new InstructionJMP(finishLabel).write());
        this._compiler.emitToFunctions(new InstructionLabel(alternateLabel).write());

        if (elseBody)
        {
            this.generateBody(statementName, elseBody);
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