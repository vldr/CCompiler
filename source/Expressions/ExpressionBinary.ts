import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeFloat from "../Types/TypeFloat";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationStack from "../Destinations/DestinationStack";
import InstructionQSTORE from "../Instructions/InstructionQSTORE";
import InstructionSTORE from "../Instructions/InstructionSTORE";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionSTOREPUSH from "../Instructions/InstructionSTOREPUSH";
import InstructionVPUSH from "../Instructions/InstructionVPUSH";
import InstructionVGETA from "../Instructions/InstructionVGETA";
import InstructionVGETB from "../Instructions/InstructionVGETB";
import NodeConstant from "../Nodes/NodeConstant";
import VariablePrimitive from "../Variables/VariablePrimitive";
import QualifierNone from "../Qualifiers/QualifierNone";
import NodeBinary from "../Nodes/NodeBinary";

export default class ExpressionBinary extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeBinary;
        const operator = node.operator.operator;
        const destination = this._destination;
        const destinationType = destination.type;

        const left = node.left;
        const right = node.right;

        if (left.type === "idenitifer")

        this._compiler.log(destinationType.toString());



        const expressionResult = new ExpressionResult(new TypeInteger(new QualifierNone(), 1), this);
        return expressionResult;
    }

    private isInlinable(type: Type, value: number): boolean
    {
        let result = false;

        if (type instanceof TypeInteger || type instanceof TypeUnsignedInteger)
        {
            if (Number.isInteger(value) && value >= 0 && value <= 4095)
            {
                result = true;
            }
        }

        return result;
    }

}