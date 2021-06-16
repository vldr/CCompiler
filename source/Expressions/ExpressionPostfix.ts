import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import Node from "../Nodes/Node";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import InstructionADD from "../Instructions/InstructionADD";
import InstructionMULT from "../Instructions/InstructionMULT";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationStack from "../Destinations/DestinationStack";
import DestinationNone from "../Destinations/DestinationNone";
import InstructionSAVE from "../Instructions/InstructionSAVE";
import InstructionSAVETOA from "../Instructions/InstructionSAVETOA";
import InstructionSAVEPUSH from "../Instructions/InstructionSAVEPUSH";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import QualifierNone from "../Qualifiers/QualifierNone";
import InstructionVGETA from "../Instructions/InstructionVGETA";
import InstructionFINC from "../Instructions/InstructionFINC";
import InstructionFDEC from "../Instructions/InstructionFDEC";
import InstructionINC from "../Instructions/InstructionINC";
import InstructionDEC from "../Instructions/InstructionDEC";
import NodeOperator from "../Nodes/NodeOperator";
import InstructionPUSH from "../Instructions/InstructionPUSH";
import InstructionPOP from "../Instructions/InstructionPOP";
import InstructionMOV from "../Instructions/InstructionMOV";
import InstructionGETB from "../Instructions/InstructionGETB";
import NodeAccessor from "../Nodes/NodeAccessor";
import NodePostfix from "../Nodes/NodePostfix";
import InstructionVGETB from "../Instructions/InstructionVGETB";
import InstructionMOVOUTPUSH from "../Instructions/InstructionMOVOUTPUSH";
import InstructionMOVOUT from "../Instructions/InstructionMOVOUT";
import ExpressionResultAccessor from "./ExpressionResultAccessor";
import InstructionMOVINPOP from "../Instructions/InstructionMOVINPOP";
import NodeFieldSelector from "../Nodes/NodeFieldSelector";
import ExpressionResultVariable from "./ExpressionResultVariable";
import VariableStruct from "../Variables/VariableStruct";
import TypeStruct from "../Types/TypeStruct";
import InstructionGETA from "../Instructions/InstructionGETA";
import TypeVoid from "../Types/TypeVoid";
import InstructionVPUSH from "../Instructions/InstructionVPUSH";
import InstructionQSTORE from "../Instructions/InstructionQSTORE";
import SymbolStructMember from "../Symbols/SymbolStructMember";
import SymbolAccessor from "../Symbols/SymbolAccessor";
import ExpressionResultConstant from "./ExpressionResultConstant";
import Utils from "../Utils";
import InstructionQADD from "../Instructions/InstructionQADD";
import InstructionQLADD from "../Instructions/InstructionQLADD";

export default class ExpressionPostfix extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodePostfix;

        const operator = node.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        let expressionResult: ExpressionResult;

        if (operator.type === "operator")
        {
            const operatorNode = operator as NodeOperator;
            const operatorSymbol = operatorNode.operator;

            switch (operatorSymbol)
            {
                case "++":
                case "--":
                    let expResult = this._compiler.generateExpression(
                        new DestinationRegisterA(destinationType), this._scope, expression
                    );

                    if (expResult instanceof ExpressionResultVariable)
                    {
                        if ((expResult as ExpressionResultVariable).variable.type.isConstant)
                        {
                            throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, expResult.variable.name);
                        }

                        if (destination.type.constructor !== TypeVoid && !expResult.type.equals(destinationType))
                        {
                            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, destinationType.toString(), expResult.type.toString());
                        }
                    }
                    else if (expResult instanceof ExpressionResultAccessor)
                    {
                        if ((expResult as ExpressionResultAccessor).variable.type.isConstant)
                        {
                            throw ExternalErrors.CANNOT_MODIFY_VARIABLE_READONLY(node, (expResult as ExpressionResultAccessor).variable.name);
                        }

                        if (destination.type.constructor !== TypeVoid && !expResult.type.equals(destinationType))
                        {
                            throw ExternalErrors.CANNOT_CONVERT_TYPE(node, destinationType.toString(), expResult.type.toString());
                        }
                    }
                    else
                    {
                        throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, operatorSymbol);
                    }

                    ///////////////////////////////////////////////////////

                    expressionResult = new ExpressionResult(expResult.type, this);

                    if (expResult instanceof ExpressionResultVariable)
                    {
                        if (destination instanceof DestinationVariable)
                        {
                            expressionResult.pushInstruction(new InstructionMOV(expResult.variable, destination.variable));
                        }
                        else if (
                            destination instanceof DestinationRegisterA ||
                            destination instanceof DestinationRegisterB ||
                            destination instanceof DestinationStack
                        )
                        {
                            expressionResult.pushInstruction(new InstructionPUSH(expResult.variable));
                        }

                        expressionResult.pushExpressionResult(expResult);
                    }
                    else if (expResult instanceof ExpressionResultAccessor)
                    {
                        expressionResult.pushExpressionResult(expResult);

                        if (!(destination instanceof DestinationNone))
                        {
                            expressionResult.pushInstruction(new InstructionMOVOUTPUSH());
                        }

                        expressionResult.pushInstruction(new InstructionSAVEPUSH());
                    }

                    ///////////////////////////////////////////////////////

                    switch (expResult.type.constructor)
                    {
                        case TypeFloat:
                            if (operatorSymbol === "++")
                                expressionResult.pushInstruction(new InstructionFINC());
                            else
                                expressionResult.pushInstruction(new InstructionFDEC());
                            break;
                        case TypeInteger:
                        case TypeUnsignedInteger:
                            if (operatorSymbol === "++")
                                expressionResult.pushInstruction(new InstructionINC());
                            else
                                expressionResult.pushInstruction(new InstructionDEC());
                            break;
                        default:
                            throw ExternalErrors.UNSUPPORTED_TYPE_FOR_UNARY_OPERATOR(node, operatorSymbol, expResult.type.toString());
                    }

                    ///////////////////////////////////////////////////////

                    if (expResult instanceof ExpressionResultVariable)
                    {
                        expressionResult.pushInstruction(new InstructionSAVE(expResult.variable));

                        if (destination instanceof DestinationRegisterA)
                        {
                            expressionResult.pushInstruction(new InstructionGETPOPA());
                        }
                        else if (destination instanceof DestinationRegisterB)
                        {
                            expressionResult.pushInstruction(new InstructionGETPOPB());
                        }
                        else if (destination instanceof DestinationVariable)
                        {
                        }
                        else if (destination instanceof DestinationStack)
                        {
                        }
                        else if (destination instanceof DestinationNone)
                        {
                        }
                        else
                        {
                            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
                        }
                    }
                    else if (expResult instanceof ExpressionResultAccessor)
                    {
                        expressionResult.pushInstruction(new InstructionMOVINPOP());

                        if (destination instanceof DestinationRegisterA)
                        {
                            expressionResult.pushInstruction(new InstructionGETPOPA());
                        }
                        else if (destination instanceof DestinationRegisterB)
                        {
                            expressionResult.pushInstruction(new InstructionGETPOPB());
                        }
                        else if (destination instanceof DestinationVariable)
                        {
                            expressionResult.pushInstruction(new InstructionPOP(destination.variable));
                        }
                        else if (destination instanceof DestinationStack)
                        {
                        }
                        else if (destination instanceof DestinationNone)
                        {
                        }
                        else
                        {
                            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
                        }
                    }

                    break;
                default:
                    throw InternalErrors.generateError("Unsupported postfix update operator.");
            }

            return expressionResult;
        }
        else if (operator.type === "accessor")
        {
            return this.generateAccessor();
        }
        else if (operator.type === "field_selector")
        {
            return this.generateFieldSelector();
        }
        else
        {
            throw InternalErrors.generateError("Unsupported postfix operator.");
        }
    }

    public generateFieldSelector(): ExpressionResultAccessor
    {
        const node = this._node as NodePostfix;
        const operator = node.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        const fieldSelectorNode = operator as NodeFieldSelector;
        const selection = fieldSelectorNode.selection;

        this._compiler.addSymbol(new SymbolStructMember(fieldSelectorNode.location));

        let targetExpressionResult = this._compiler.generateExpression(
            new DestinationNone(destinationType), this._scope, expression
        );

        if (targetExpressionResult instanceof ExpressionResultVariable)
        {
            if (selection === "length" && targetExpressionResult.type.arraySize > 0)
            {
                return this.generateArrayLength(expression, targetExpressionResult.type) as ExpressionResultAccessor;
            }

            if (!(targetExpressionResult.variable instanceof VariableStruct))
            {
                throw ExternalErrors.TYPE_MUST_BE_STRUCT(node);
            }

            const structVariable = targetExpressionResult.variable as VariableStruct;
            const targetVariable = structVariable.members.get(selection)

            if (structVariable.type.arraySize > 0)
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, structVariable.type.toString(), structVariable.type.cloneSingular().toString());
            }

            if (targetVariable === undefined)
            {
                throw ExternalErrors.CANNOT_FIND_NAME(node, selection);
            }

            const expressionResult = new ExpressionResultVariable(
                targetVariable.type,
                this,
                targetVariable
            );

            if (destination instanceof DestinationVariable)
            {
                expressionResult.pushInstruction(new InstructionMOV(targetVariable, destination.variable));
            }
            else if (destination instanceof DestinationStack)
            {
                expressionResult.pushInstruction(new InstructionPUSH(targetVariable));
            }
            else if (destination instanceof DestinationRegisterA)
            {
                expressionResult.pushInstruction(new InstructionGETA(targetVariable));
            }
            else if (destination instanceof DestinationRegisterB)
            {
                expressionResult.pushInstruction(new InstructionGETB(targetVariable));
            }
            else if (destination instanceof DestinationNone)
            {
            }
            else
            {
                throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
            }

            return expressionResult;
        }
        else if (targetExpressionResult instanceof ExpressionResultAccessor)
        {
            if (selection === "length" && targetExpressionResult.type.arraySize > 0)
            {
                return this.generateArrayLength(expression, targetExpressionResult.type) as ExpressionResultAccessor;
            }

            if (!(targetExpressionResult.variable instanceof VariableStruct))
            {
                throw ExternalErrors.TYPE_MUST_BE_STRUCT(node);
            }

            const structVariable = targetExpressionResult.variable as VariableStruct;
            const targetVariable = structVariable.members.get(selection);

            if (destinationType.arraySize > 0)
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, structVariable.type.toString(), (structVariable.type as TypeStruct).name);
            }

            if (targetVariable === undefined)
            {
                throw ExternalErrors.CANNOT_FIND_NAME(node, selection);
            }

            const calcTotalSizeStruct = (type: TypeStruct) =>
            {
                let totalSize = 0;

                type.members.forEach((t) =>
                {
                    if (t instanceof TypeStruct)
                    {
                        totalSize += calcTotalSizeStruct(t) * Math.max(t.arraySize, 1);
                    }
                    else
                    {
                        totalSize += Math.max(t.arraySize, 1) /* 32 bits */;
                    }
                });

                return totalSize;
            };

            const calcTotalSize = (type: Type) =>
            {
                let totalSize = 0;

                if (type instanceof TypeStruct)
                {
                    totalSize += calcTotalSizeStruct(type) * Math.max(type.arraySize, 1);
                }
                else
                {
                    totalSize += Math.max(type.arraySize, 1);
                }

                return totalSize;
            };

            let offset = 0;
            let shouldCount = true;

            const targetVariableIndex = (structVariable.type as TypeStruct).members.forEach(((value, key) =>
            {
                if (shouldCount)
                {
                    if (key === selection)
                        shouldCount = false;
                    else
                        offset += calcTotalSize(value);
                }
            }))

            const expressionResult = new ExpressionResultAccessor(
                targetVariable.type,
                this,
                targetVariable
            );

            targetExpressionResult = this._compiler.generateExpression(
                new DestinationNone(destinationType), this._scope, expression
            );

            expressionResult.pushExpressionResult(targetExpressionResult);
            expressionResult.pushInstruction(new InstructionSAVETOA());
            expressionResult.pushInstruction(new InstructionVGETB(offset.toString()));
            expressionResult.pushInstruction(new InstructionADD(new TypeInteger(new QualifierNone(), 0)));

            if (destination instanceof DestinationNone)
            {
            }
            else if (destination instanceof DestinationVariable)
            {
                expressionResult.pushInstruction(new InstructionMOVOUT(destination.variable));
            }
            else
            {
                expressionResult.pushInstruction(new InstructionMOVOUTPUSH());
            }

            if (destination instanceof DestinationRegisterA)
            {
                expressionResult.pushInstruction(new InstructionGETPOPA());
            }
            else if (destination instanceof DestinationRegisterB)
            {
                expressionResult.pushInstruction(new InstructionGETPOPB());
            }
            else if (destination instanceof DestinationStack)
            {
            }
            else if (destination instanceof DestinationVariable)
            {
            }
            else if (destination instanceof DestinationNone)
            {
            }
            else
            {
                throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
            }

            return expressionResult;
        }
        else
        {
            throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, ".");
        }
    }

    public generateAccessor(): ExpressionResultAccessor
    {
        const node = this._node as NodePostfix;

        const operator = node.operator;
        const destination = this._destination;
        const destinationType = destination.type;
        const expression = node.expression;

        const accessorNode = operator as NodeAccessor;
        let targetExpressionResult = this._compiler.generateExpression(
            new DestinationNone(destinationType), this._scope, expression
        ) as ExpressionResultVariable;

        if (!(targetExpressionResult instanceof ExpressionResultVariable)
            && !((targetExpressionResult as any) instanceof ExpressionResultAccessor))
        {
            throw ExternalErrors.OPERATOR_EXPECTS_VARIABLE(node, "[]");
        }

        if (targetExpressionResult.type.arraySize <= 0)
        {
            throw ExternalErrors.MUST_BE_ARRAY_TYPE(node, targetExpressionResult.type.toString());
        }

        const newType = targetExpressionResult.type.cloneSingular();

        const expressionResult = new ExpressionResultAccessor(
            newType,
            this,
            targetExpressionResult.variable
        );

        if (targetExpressionResult instanceof ExpressionResultAccessor)
        {
            expressionResult.pushInstruction(targetExpressionResult);
            expressionResult.pushInstruction(new InstructionSAVEPUSH());
        }

        const indexExpressionResult = this._compiler.generateExpression(
            new DestinationRegisterA(new TypeVoid(new QualifierNone(), 0)), this._scope, accessorNode.index
        );

        if (!(indexExpressionResult.type instanceof TypeInteger) && !(indexExpressionResult.type instanceof TypeUnsignedInteger))
        {
            throw ExternalErrors.CANNOT_CONVERT_TYPE(accessorNode, indexExpressionResult.type.toString(), "int | uint");
        }

        if (indexExpressionResult.type.arraySize > 0 || indexExpressionResult.type instanceof TypeStruct)
        {
            throw ExternalErrors.CANNOT_NO_STRUCT_ARRAY(accessorNode);
        }

        if (
            targetExpressionResult instanceof ExpressionResultVariable &&
            indexExpressionResult instanceof ExpressionResultConstant &&
            !(newType instanceof TypeStruct) &&
            Utils.isInlinable(indexExpressionResult.type, indexExpressionResult.value)
        )
        {
            expressionResult.pushInstruction(new InstructionQADD(targetExpressionResult.variable.labelName, indexExpressionResult.value.toString()));
        }
        else if (
            targetExpressionResult instanceof ExpressionResultVariable &&
            indexExpressionResult instanceof ExpressionResultVariable &&
            !(newType instanceof TypeStruct)
        )
        {
            expressionResult.pushInstruction(new InstructionQLADD(indexExpressionResult.variable.labelName, targetExpressionResult.variable.labelName));
        }
        else
        {
            if (newType instanceof TypeStruct)
            {
                expressionResult.pushExpressionResult(indexExpressionResult);

                const calcTotalSize = (type: TypeStruct) =>
                {
                    let totalSize = 0;

                    type.members.forEach((t) =>
                    {
                        if (t instanceof TypeStruct)
                        {
                            totalSize += calcTotalSize(t) * Math.max(t.arraySize, 1);
                        }
                        else
                        {
                            totalSize += Math.max(t.arraySize, 1) /* 32 bits */;
                        }
                    });

                    return totalSize;
                };

                let totalSize = calcTotalSize((targetExpressionResult.type as TypeStruct));

                expressionResult.pushInstruction(new InstructionVGETB(totalSize.toString()));
                expressionResult.pushInstruction(new InstructionMULT(new TypeInteger(new QualifierNone(), 0)));
                expressionResult.pushInstruction(new InstructionSAVETOA());
            }
            else
            {
                expressionResult.pushExpressionResult(indexExpressionResult);
            }

            if (targetExpressionResult instanceof ExpressionResultAccessor)
            {
                expressionResult.pushInstruction(new InstructionGETPOPB());
            }
            else
            {
                expressionResult.pushInstruction(new InstructionVGETB(targetExpressionResult.variable.labelName));
            }

            expressionResult.pushInstruction(new InstructionADD(new TypeInteger(new QualifierNone(), 0)));
        }

        if (destination instanceof DestinationNone)
        {
        }
        else if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionMOVOUT(destination.variable));
        }
        else
        {
            expressionResult.pushInstruction(new InstructionMOVOUTPUSH());
        }

        if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionGETPOPA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionGETPOPB());
        }
        else if (destination instanceof DestinationStack)
        {
        }
        else if (destination instanceof DestinationVariable)
        {
        }
        else if (destination instanceof DestinationNone)
        {
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private generateArrayLength(node: Node, type: Type): ExpressionResult
    {
        if (type.arraySize <= 0)
            throw ExternalErrors.MUST_BE_ARRAY_TYPE(node, type.toString());

        const expressionResult = new ExpressionResultConstant(
            new TypeInteger(new QualifierNone(), 0),
            this,
            type.arraySize
        );

        const destination = this._destination;

        if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionVGETA(type.arraySize.toString()));
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionVGETB(type.arraySize.toString()));
        }
        else if (destination instanceof DestinationStack)
        {
            expressionResult.pushInstruction(new InstructionVPUSH(type.arraySize.toString()));
        }
        else if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionQSTORE(type.arraySize.toString(), destination.variable));
        }
        else if (destination instanceof DestinationNone)
        {
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

}