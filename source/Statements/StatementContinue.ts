import Statement from "./Statement";
import ExternalErrors from "../Errors/ExternalErrors";
import Node from "../Nodes/Node";
import InstructionJMP from "../Instructions/InstructionJMP";

export default class StatementContinue extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as Node;
        const loop = this._scope.getLoop();

        if (loop === undefined)
        {
            throw ExternalErrors.CONTINUE_CAN_ONLY_BE_USED_IN_LOOP(node);
        }

        this._compiler.emitToFunctions(new InstructionJMP(loop.restartLabel).write());
    }
}