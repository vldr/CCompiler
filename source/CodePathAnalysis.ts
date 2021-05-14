import Node from "./Nodes/Node";
import NodeScope from "./Nodes/NodeScope";
import NodeIfStatement from "./Nodes/NodeIfStatement";
import NodeWhileStatement from "./Nodes/NodeWhileStatement";
import NodeConstant from "./Nodes/NodeConstant";
import NodeDoStatement from "./Nodes/NodeDoStatement";
import NodeForStatement from "./Nodes/NodeForStatement";
import NodeTypeCast from "./Nodes/NodeTypeCast";

export default class CodePathAnalysis
{
    public static returnsAllPaths(node: Node): boolean
    {
        switch (node.type)
        {
            case "return":
                return true;
            case "scope":
                return this.returnsAllPathsScopeStatement(node as unknown as NodeScope);
            case "if_statement":
                return this.returnsAllPathsIfStatement(node as unknown as NodeIfStatement);
            case "while_statement":
                return this.returnsAllPathsWhileStatement(node as unknown as NodeWhileStatement);
            case "do_statement":
                return this.returnsAllPathsDoStatement(node as unknown as NodeDoStatement);
            case "for_statement":
                return this.returnsAllPathsForStatement(node as unknown as NodeForStatement);
            default:
                return false;
        }
    }

    private static doesContainBreak(node: Node): boolean
    {
        switch (node.type)
        {
            case "break":
                return true;
            case "scope": {
                let result = false;

                (node as unknown as NodeScope).statements.forEach((node) => {
                    if (this.doesContainBreak(node)) {
                        result = true;
                    }
                });

                return result;
            }
            case "if_statement": {
                const nodeIfStatement = (node as unknown as NodeIfStatement);

                let result = this.doesContainBreak(nodeIfStatement.body);

                if (!result && nodeIfStatement.elseBody)
                {
                    result = this.doesContainBreak(nodeIfStatement.elseBody);
                }

                return result;
            }
            default:
                return false;
        }
    }

    private static returnsAllPathsScopeStatement(node: NodeScope): boolean
    {
        let result = false;

        node.statements.forEach((node) =>
        {
            if (this.returnsAllPaths(node))
            {
                result = true;
            }
        });

        return result;
    }

    private static returnsAllPathsIfStatement(node: NodeIfStatement): boolean
    {
        let doesTruePathReturn = this.returnsAllPaths(node.body);
        let doesFalsePathReturn = false;

        if (node.elseBody)
        {
            doesFalsePathReturn = this.returnsAllPaths(node.elseBody);
        }

        return doesTruePathReturn && doesFalsePathReturn;
    }

    private static returnsAllPathsDoStatement(node: NodeDoStatement): boolean
    {
        return this.returnsAllPaths(node.body);
    }

    private static returnsAllPathsWhileStatement(node: NodeWhileStatement): boolean
    {
        if (this.isAlwaysTrue(node.condition) && !this.doesContainBreak(node.body))
        {
            return this.returnsAllPaths(node.body);
        }

        return false;
    }

    private static returnsAllPathsForStatement(node: NodeForStatement): boolean
    {
        if ((node.condition === null || this.isAlwaysTrue(node.condition)) && !this.doesContainBreak(node.body))
        {
            return this.returnsAllPaths(node.body);
        }

        return false;
    }

    private static isAlwaysTrue(node: Node): boolean
    {
        if (
            (node.type === "int" || node.type === "uint") &&
            (node as unknown as NodeConstant).value_base10 != 0
        )
        {
            return true;
        }
        else if (node.type === "type_cast")
        {
            return this.isAlwaysTrue((node as unknown as NodeTypeCast).expression);
        }

        return false;
    }
}