export default class Interpreter
{
    private _registerA: ArrayBuffer = new Uint32Array([ 0 ]);
    private _registerB: ArrayBuffer = new Uint32Array([ 0 ]);
    private _registerR: ArrayBuffer = new Uint32Array([ 0 ]);
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

    get registerA() { return this._registerA.slice(0); }
    get registerB() { return this._registerB.slice(0); }
    get registerR() { return this._registerR.slice(0); }
    get stack() { return this._stack; }
    get memoryRegions() { return this._memoryRegions; }

    public run()
    {
        this._programCounter = 0;

        this.processLabels();
        this.processMemoryRegions();
        this.processInstructions();
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

        let memoryLocation = this._labels.get(str);

        if (memoryLocation)
        {
            return new Uint32Array([ memoryLocation ]);
        }
        else
        {
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
                if (str.includes(".") || Number.isNaN(integerValue))
                {
                    throw instruction.error(location, "Invalid value provided.");
                }

                return integerValue < 0 ? new Int32Array([ integerValue ]) : new Uint32Array([ integerValue ]);
            }
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
        this.setMemoryNumericValue(instruction, labelLocation, this.getNumericValue(instruction, valueLocation));
    }

    private setMemoryNumericValue(instruction: InterpreterInstruction, labelLocation: InterpreterLocation, value: ArrayBuffer)
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

        this._memoryRegions.set(label, value.slice(0));
    }

    private setMemoryNumericValueByAddress(instruction: InterpreterInstruction, address: number, value: ArrayBuffer)
    {
        let label: string | undefined;

        this._labels.forEach((_address, _label) =>
        {
            if (address === _address)
            {
                label = _label;
            }
        });

        if (!label)
        {
            throw instruction.error(InterpreterLocation.Operand, "Unable to resolve address to a memory region.");
        }

        const memoryRegion = this._memoryRegions.get(label);

        if (memoryRegion)
        {
            this._memoryRegions.set(label, value.slice(0));
        }
        else
        {
            throw instruction.error(InterpreterLocation.Operand, "The corresponding address does not " +
                "corresponding to a given memory region (buffer overrun?).");
        }
    }

    private getMemoryNumericValueByAddress(instruction: InterpreterInstruction, address: number): ArrayBuffer
    {
        let label: string | undefined;

        this._labels.forEach((_address, _label) =>
        {
            if (address === _address)
            {
                label = _label;
            }
        });

        if (!label)
        {
            throw instruction.error(InterpreterLocation.Operand, "Unable to resolve address to a memory region.");
        }

        const value = this._memoryRegions.get(label);

        if (value)
        {
            return value;
        }
        else
        {
            throw instruction.error(InterpreterLocation.Operand, "The corresponding address does not " +
                "corresponding to a given memory region (buffer overrun?).");
        }
    }

    private pushMemory(instruction: InterpreterInstruction, labelLocation: InterpreterLocation)
    {
        let value = this.getMemoryValue(instruction, labelLocation);

        this._stack.push(value.slice(0));
    }

    private pushNumericValue(instruction: InterpreterInstruction, valueLocation: InterpreterLocation)
    {
        let value = this.getNumericValue(instruction, valueLocation);

        this._stack.push(value.slice(0));
    }

    private pushValue(instruction: InterpreterInstruction, value: ArrayBuffer)
    {
        this._stack.push(value.slice(0));
    }

    public popValue(instruction: InterpreterInstruction): ArrayBuffer
    {
        const value = this._stack.pop();

        if (!value)
        {
            throw instruction.error(InterpreterLocation.Operand, "Stack was empty.")
        }

        return value.slice(0);
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
    }

    private processInstructions()
    {
        let isRunning = true;

        while (isRunning)
        {
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
                else if (
                    instruction.operand === "PUSH" ||
                    instruction.operand === "VPUSH" ||
                    instruction.operand === "SAVEPUSH" ||
                    instruction.operand === "MOVOUTPUSH" ||
                    instruction.operand === "STOREPUSH"
                )
                {
                    this.interpretPUSH(instruction);
                }
                else if (
                    instruction.operand === "POP" ||
                    instruction.operand === "GETPOPA" ||
                    instruction.operand === "GETPOPB" ||
                    instruction.operand === "GETPOPR" ||
                    instruction.operand === "POPNOP" ||
                    instruction.operand === "MOVINPOP"
                )
                {
                    this.interpretPOP(instruction);
                }
                else if (
                    instruction.operand === "SAVE" ||
                    instruction.operand === "SAVEA" ||
                    instruction.operand === "SAVEB" ||
                    instruction.operand === "SAVETOA" ||
                    instruction.operand === "SAVETOB"
                )
                {
                    this.interpretSAVE(instruction);
                }
                else
                {
                    throw instruction.error(InterpreterLocation.Operand, "Unimplemented instruction '" + instruction.operand + "'.")
                }
            }

            this._programCounter++;
        }
    }

    // Implement InstructionVGETA.ts
    // Implement InstructionVGETB.ts
    // Implement InstructionGETA.ts
    // Implement InstructionGETB.ts
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
            instruction.error(InterpreterLocation.Operand, "Unknown operand for GET-like instruction.");
        }
    }

    // Implement InstructionPUSH.ts
    // Implement InstructionVPUSH.ts
    // Implement InstructionSAVEPUSH.ts
    // Implement InstructionSTOREPUSH.ts
    // Implement InstructionMOVOUTPUSH.ts
    public interpretPUSH(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "PUSH")
        {
            this.pushMemory(instruction, InterpreterLocation.Arg0);
        }
        else if (instruction.operand === "VPUSH" || instruction.operand === "STOREPUSH")
        {
            this.pushNumericValue(instruction, InterpreterLocation.Arg0);
        }
        else if (instruction.operand === "SAVEPUSH")
        {
            this.pushValue(instruction, this._registerR);
        }
        else if (instruction.operand === "MOVOUTPUSH")
        {
            const address = new Uint32Array(this._registerR)[0];
            const value = this.getMemoryNumericValueByAddress(instruction, address);

            this.pushValue(instruction, value);
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for PUSH-like instruction.");
        }
    }

    // Implement InstructionPOP.ts
    // Implement InstructionGETPOPA.ts
    // Implement InstructionGETPOPB.ts
    // Implement InstructionGETPOPR.ts
    // Implement InstructionPOPNOP.ts
    // Implement InstructionMOVINPOP.ts
    public interpretPOP(instruction: InterpreterInstruction)
    {
        const value = this.popValue(instruction);

        if (instruction.operand === "POP")
        {
            this.setMemoryNumericValue(instruction, InterpreterLocation.Arg0, value);
        }
        else if (instruction.operand === "GETPOPA")
        {
            this._registerA = value;
        }
        else if (instruction.operand === "GETPOPB")
        {
            this._registerB = value;
        }
        else if (instruction.operand === "GETPOPR")
        {
            this._registerR = value;
        }
        else if (instruction.operand === "MOVINPOP")
        {
            const address = new Uint32Array(value)[0];

            this.setMemoryNumericValueByAddress(instruction, address, this._registerR);
        }
        else if (instruction.operand === "POPNOP") {}
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for POP-like instruction.");
        }
    }

    // Implement InstructionSAVE.ts
    // Implement InstructionSAVEA.ts
    // Implement InstructionSAVEB.ts
    // Implement InstructionSAVETOA.ts
    // Implement InstructionSAVETOB.ts
    public interpretSAVE(instruction: InterpreterInstruction)
    {

        if (instruction.operand === "SAVE")
        {
            this.setMemoryNumericValue(instruction, InterpreterLocation.Arg0, this._registerR);
        }
        else if (instruction.operand === "SAVEA")
        {
            this.setMemoryNumericValue(instruction, InterpreterLocation.Arg0, this._registerA);
        }
        else if (instruction.operand === "SAVEB")
        {
            this.setMemoryNumericValue(instruction, InterpreterLocation.Arg0, this._registerB);
        }
        else if (instruction.operand === "SAVETOA")
        {
            this._registerA = this.registerR.slice(0);
        }
        else if (instruction.operand === "SAVETOB")
        {
            this._registerB = this.registerR.slice(0);
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for SAVE-like instruction.");
        }
    }



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
    // TODO: Implement InstructionMOVOUT.ts
    // TODO: Implement InstructionMULT.ts
    // TODO: Implement InstructionNEG.ts
    // TODO: Implement InstructionNOT.ts
    // TODO: Implement InstructionOR.ts



    // TODO: Implement InstructionQADD.ts
    // TODO: Implement InstructionQSTORE.ts
    // TODO: Implement InstructionRAND.ts
    // TODO: Implement InstructionREM.ts
    // TODO: Implement InstructionRTN.ts
    // TODO: Implement InstructionSETLED.ts
    // TODO: Implement InstructionSHIFTL.ts
    // TODO: Implement InstructionSHIFTR.ts
    // TODO: Implement InstructionSNEG.ts
    // TODO: Implement InstructionSTORE.ts

    // TODO: Implement InstructionSUB.ts
    // TODO: Implement InstructionTICK.ts


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
