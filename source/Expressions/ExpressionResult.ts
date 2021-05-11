import Type from "../Types/Type";
import Expression from "./Expression";
import Instruction from "../Instructions/Instruction";

export default class ExpressionResult
{
    private instructions: Array<Instruction>;

    constructor(
        public type: Type,
        public readonly expression: Expression
    )
    {
        this.instructions = new Array<Instruction>();
    }

    public pushExpressionResult(other: ExpressionResult)
    {
        other.instructions.forEach((instruction) => this.instructions.push(instruction));
    }

    public pushInstruction(instruction: Instruction)
    {
        this.instructions.push(instruction);
    }

    public popInstruction(): Instruction | undefined
    {
        return this.instructions.pop();
    }

    public write(): string
    {
        return this.instructions.map(s => s.write()).join("");
    }
}