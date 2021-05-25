import CompilerMessage from "./CompilerMessage";
import Node from "../Nodes/Node";
import Compiler from "../Compiler";

export default abstract class ExternalWarnings
{
    private static generateWarning(messageId: string, message: string, node: Node, compiler: Compiler)
    {
        compiler.addWarning(new CompilerMessage(
            messageId,
            message,
            node.location
        ));
    }

    static NOT_ALL_PATHS_RETURN(node: Node, compiler: Compiler)
    {
        return this.generateWarning("C0001W",`Not all code paths return a value.`, node, compiler);
    }

}