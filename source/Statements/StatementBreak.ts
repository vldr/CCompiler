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
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";

export default class StatementBreak extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as Node;
        const loop = this._scope.getLoop();

        if (loop === undefined)
        {
            throw ExternalErrors.BREAK_CAN_ONLY_BE_USED_IN_LOOP(node);
        }

        this._compiler.emitToFunctions(new InstructionJMP(loop.endLabelName).write());
    }
}