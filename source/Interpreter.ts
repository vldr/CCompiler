export default class Interpreter
{
    private _registerA = new ArrayBuffer(4);
    private _registerB = new ArrayBuffer(4);
    private _registerR = new ArrayBuffer(4);
    private _stack = new Array<ArrayBuffer>();
    private _programCounter: number;

    private _labels = new Map<string, number>();
    private _memoryRegions = new Map<string, ArrayBuffer>();

    private _instructions: Array<string>;

    constructor(public readonly content: string)
    {
        this._instructions = content
            .split("\n")
            .map((line) => line.replace("\n", "").trim());
    }

    public run()
    {
        this._programCounter = 0;

        this.processLabels();
        this.processMemoryRegions();
        this.processInstructions();

        console.log();
        console.log("Register A: " + this._registerA);
        console.log("Register B: " + this._registerB);
        console.log("Register R: " + this._registerR);
    }

    private getNumericValue(instruction: InterpreterInstruction, location: InterpreterLocation): ArrayBuffer
    {
        let str = String();

        switch (location)
        {
            case InterpreterLocation.Operand:
                if (instruction.operand) str = instruction.operand;
                break;
            case InterpreterLocation.Arg0:
                if (instruction.arg0) str = instruction.arg0;
                break;
            case InterpreterLocation.Arg1:
                if (instruction.arg1) str = instruction.arg1;
                break;
        }

        if (str.endsWith("f"))
        {
            str = str.replace("f", "");

            const floatValue = Number.parseFloat(str);
            if (Number.isNaN(floatValue))
            {
                throw instruction.error(location, "Invalid floating point value provided.");
            }

            return new Float32Array([ floatValue ]);
        }
        else
        {
            const integerValue = Number.parseInt(str);
            if (Number.isNaN(integerValue))
            {
                throw instruction.error(location, "Invalid value provided.");
            }

            return new Uint32Array([ integerValue ]);
        }
    }

    private getMemoryValue(instruction: InterpreterInstruction, location: InterpreterLocation): ArrayBuffer
    {
        let label = String();

        switch (location)
        {
            case InterpreterLocation.Operand:
                if (instruction.operand) label = instruction.operand;
                break;
            case InterpreterLocation.Arg0:
                if (instruction.arg0) label = instruction.arg0;
                break;
            case InterpreterLocation.Arg1:
                if (instruction.arg1) label = instruction.arg1;
                break;
        }

        const value = this._memoryRegions.get(label);
        if (!value)
            throw instruction.error(location, "Invalid memory region provided.");

        return value.slice(0);
    }

    private setMemoryValue(instruction: InterpreterInstruction, labelLocation: InterpreterLocation, valueLocation: InterpreterLocation)
    {
        let label = String();

        switch (labelLocation)
        {
            case InterpreterLocation.Operand:
                if (instruction.operand) label = instruction.operand;
                break;
            case InterpreterLocation.Arg0:
                if (instruction.arg0) label = instruction.arg0;
                break;
            case InterpreterLocation.Arg1:
                if (instruction.arg1) label = instruction.arg1;
                break;
        }

        if (!this._memoryRegions.get(label))
            throw instruction.error(labelLocation, "Invalid memory region provided.");

        //////////////////////////////////////////////////////////

        let value = this.getNumericValue(instruction, valueLocation);

        this._memoryRegions.set(label, value.slice(0));
    }

    private pushMemory(instruction: InterpreterInstruction, labelLocation: InterpreterLocation)
    {
        let value = this.getMemoryValue(instruction, labelLocation);

        this._stack.push(value.slice(0));
    }

    private pushValue(instruction: InterpreterInstruction, valueLocation: InterpreterLocation,)
    {
        let value = this.getNumericValue(instruction, valueLocation);

        this._stack.push(value.slice(0));
    }

    private popStack(): ArrayBuffer | undefined
    {
        return this._stack.pop()?.slice(0);
    }

    private processLabels()
    {
        for (let i = 0; i < this._instructions.length; i++)
        {
            const instruction = new InterpreterInstruction(this._instructions[i], i);

            if (instruction.operand && instruction.operand.endsWith(":"))
            {
                const line = instruction.operand.replace(":", "");

                this._labels.set(line, i + 1);
            }
        }
    }

    private processMemoryRegions()
    {
        this._labels.forEach((location, label) =>
        {
            if (location in this._instructions)
            {
                const instruction = new InterpreterInstruction(this._instructions[location], location);

                if (instruction.arg0 && instruction.operand === ".data")
                {

                    this._memoryRegions.set(label, this.getNumericValue(instruction, InterpreterLocation.Arg0));
                }
            }
        });

        console.log(this._memoryRegions);
    }

    private processInstructions()
    {
        let isRunning = true;

        while (isRunning)
        {
            console.log(this._instructions[this._programCounter])
            const instruction = new InterpreterInstruction(this._instructions[this._programCounter], this._programCounter);

            if (instruction.operand)
            {
                if (instruction.operand === "HALT")
                {
                    isRunning = false;
                }
                else if (
                    instruction.operand === "GETA" ||
                    instruction.operand === "GETB" ||
                    instruction.operand === "VGETA" ||
                    instruction.operand === "VGETB"
                )
                {
                    this.interpretGET(instruction);
                }
                else
                {
                    throw instruction.error(InterpreterLocation.Operand, "Unimplemented instruction '" + instruction.operand + "'.")
                }
            }

            this._programCounter++;
        }
    }

    public interpretGET(instruction: InterpreterInstruction)
    {
        let value: ArrayBuffer;

        if (instruction.operand?.startsWith("V") )
        {
            value = this.getNumericValue(instruction, InterpreterLocation.Arg0);
        }
        else
        {
            value = this.getMemoryValue(instruction, InterpreterLocation.Arg0)
        }

        if (instruction.operand?.endsWith("A"))
        {
            this._registerA = value;
        }
        else if (instruction.operand?.endsWith("B"))
        {
            this._registerB = value;
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for GET instruction.");
        }
    }

    // TODO: Implement InstructionGETA.ts
    // TODO: Implement InstructionGETB.ts
    // TODO: Implement InstructionGETPOPA.ts
    // TODO: Implement InstructionGETPOPB.ts
    // TODO: Implement InstructionGETPOPR.ts

    // TODO: Implement InstructionPOP.ts
    // TODO: Implement InstructionPUSH.ts

    // TODO: Implement InstructionADD.ts
    // TODO: Implement InstructionAND.ts
    // TODO: Implement InstructionCALL.ts
    // TODO: Implement InstructionCMP.ts
    // TODO: Implement InstructionComment.ts
    // TODO: Implement InstructionDEC.ts
    // TODO: Implement InstructionDIV.ts
    // TODO: Implement InstructionFDEC.ts
    // TODO: Implement InstructionFINC.ts
    // TODO: Implement InstructionFLTOINT.ts
    // TODO: Implement InstructionFNEG.ts


    // TODO: Implement InstructionINC.ts
    // TODO: Implement InstructionINTTOFL.ts
    // TODO: Implement InstructionJA.ts
    // TODO: Implement InstructionJMP.ts
    // TODO: Implement InstructionJNA.ts
    // TODO: Implement InstructionLabel.ts
    // TODO: Implement InstructionLAND.ts
    // TODO: Implement InstructionLOR.ts
    // TODO: Implement InstructionMOV.ts
    // TODO: Implement InstructionMOVIN.ts
    // TODO: Implement InstructionMOVINPOP.ts
    // TODO: Implement InstructionMOVOUT.ts
    // TODO: Implement InstructionMOVOUTPUSH.ts
    // TODO: Implement InstructionMULT.ts
    // TODO: Implement InstructionNEG.ts
    // TODO: Implement InstructionNOT.ts
    // TODO: Implement InstructionOR.ts

    // TODO: Implement InstructionPOPNOP.ts

    // TODO: Implement InstructionQADD.ts
    // TODO: Implement InstructionQSTORE.ts
    // TODO: Implement InstructionRAND.ts
    // TODO: Implement InstructionREM.ts
    // TODO: Implement InstructionRTN.ts
    // TODO: Implement InstructionSAVE.ts
    // TODO: Implement InstructionSAVEA.ts
    // TODO: Implement InstructionSAVEB.ts
    // TODO: Implement InstructionSAVEPUSH.ts
    // TODO: Implement InstructionSAVETOA.ts
    // TODO: Implement InstructionSAVETOB.ts
    // TODO: Implement InstructionSETLED.ts
    // TODO: Implement InstructionSHIFTL.ts
    // TODO: Implement InstructionSHIFTR.ts
    // TODO: Implement InstructionSNEG.ts
    // TODO: Implement InstructionSTORE.ts
    // TODO: Implement InstructionSTOREPUSH.ts
    // TODO: Implement InstructionSUB.ts
    // TODO: Implement InstructionTICK.ts
    // TODO: Implement InstructionVGETA.ts
    // TODO: Implement InstructionVGETB.ts
    // TODO: Implement InstructionVPUSH.ts
    // TODO: Implement InstructionXOR.ts
}

enum InterpreterLocation {
    Operand,
    Arg0,
    Arg1
}

class InterpreterInstruction
{
    private _instructionParts: string[];

    constructor(private _instruction: string, private _lineNumber: number)
    {
        this._instructionParts = _instruction.split(" ");
    }

    public error(location: InterpreterLocation, message: string): Error
    {
        switch (location)
        {
            case InterpreterLocation.Operand:
                return this.generateError(this._instruction, this._lineNumber, 0, this._instructionParts[0].length - 1, message);
            case InterpreterLocation.Arg0:
                return this.generateError(this._instruction, this._lineNumber, this._instructionParts[0].length + 1, this._instructionParts[1].length - 1, message);
            case InterpreterLocation.Arg1:
                return this.generateError(this._instruction, this._lineNumber, this._instructionParts[1].length + 1, this._instructionParts[2].length - 1, message);
        }
    }

    private generateError(line: string, lineNumber: number, start: number, end: number, message: string): Error
    {
        let buffer = String();

        buffer += `line ${lineNumber}: ${message}\n`;
        buffer += `\t${line}\n`;

        buffer += "\t";

        for (let i = 0; i < start; i++)
            buffer += " ";

        buffer += "^";

        for (let i = 0; i < end; i++)
            buffer += "~";

        buffer += "\n";

        return new Error(buffer);
    }

    get operand()
    {
        if (this._instructionParts.length >= 1)
        {
            return this._instructionParts[0];
        }
        else
        {
            return undefined;
        }
    }

    get arg0()
    {
        if (this._instructionParts.length >= 2)
        {
            return this._instructionParts[1];
        }
        else
        {
            return undefined;
        }
    }

    get arg1()
    {
        if (this._instructionParts.length >= 3)
        {
            return this._instructionParts[2];
        }
        else
        {
            return undefined;
        }
    }

    get length()
    {
        return this._instructionParts.length;
    }
}
