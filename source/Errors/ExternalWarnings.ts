import CompilerMessage from "./CompilerMessage";
import Node from "../Nodes/Node";
import Compiler from "../Compiler";

export default abstract class ExternalWarnings
{
    private static generateWarning(message: string, node: Node, compiler: Compiler)
    {
        compiler.addWarning(new CompilerMessage(
            message,
            node.location
        ));
    }

    static NOT_ALL_PATHS_RETURN(node: Node, compiler: Compiler)
    {
        return this.generateWarning(`Not all code paths return a value.`, node, compiler);
    }

}