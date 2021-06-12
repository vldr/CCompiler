export default class Interpreter
{
    private _registerA: ArrayBuffer = new Uint32Array([ 0 ]);
    private _registerB: ArrayBuffer = new Uint32Array([ 0 ]);
    private _registerR: ArrayBuffer = new Uint32Array([ 0 ]);
    private _stack = new Array<ArrayBuffer>();
    private _callStack = new Array<number>();
    private _programCounter: number;

    private _labels = new Map<string, InterpreterLabel>();
    private _memoryRegions = new Map<string, ArrayBuffer>();

    private _instructions: Array<string>;
    private _didModifyProgramCounter: boolean;
    private _exports: InterpreterWasmExport;

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

    public async run()
    {
        await this.runWithoutStackCheck();

        if (this.stack.length !== 0)
            throw Error("stack is not empty.");
    }

    public async runWithoutStackCheck()
    {
        this._programCounter = 0;

        await this.initExports();

        this.processLabels();
        this.processMemoryRegions();
        this.processInstructions();
    }

    private async initExports()
    {
        const data = Buffer.from([
            0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00, 0x01, 0x0D, 0x02, 0x60,
            0x02, 0x7F, 0x7F, 0x01, 0x7F, 0x60, 0x02, 0x7D, 0x7D, 0x01, 0x7D, 0x03,
            0x0B, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01,
            0x07, 0x43, 0x0A, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x03, 0x73, 0x75,
            0x62, 0x00, 0x01, 0x03, 0x6D, 0x75, 0x6C, 0x00, 0x02, 0x03, 0x72, 0x65,
            0x6D, 0x00, 0x05, 0x04, 0x69, 0x64, 0x69, 0x76, 0x00, 0x03, 0x04, 0x75,
            0x64, 0x69, 0x76, 0x00, 0x04, 0x04, 0x66, 0x61, 0x64, 0x64, 0x00, 0x06,
            0x04, 0x66, 0x73, 0x75, 0x62, 0x00, 0x07, 0x04, 0x66, 0x6D, 0x75, 0x6C,
            0x00, 0x08, 0x04, 0x66, 0x64, 0x69, 0x76, 0x00, 0x09, 0x0A, 0x51, 0x0A,
            0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6A, 0x0B, 0x07, 0x00, 0x20, 0x00,
            0x20, 0x01, 0x6B, 0x0B, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6C, 0x0B,
            0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6D, 0x0B, 0x07, 0x00, 0x20, 0x00,
            0x20, 0x01, 0x6E, 0x0B, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x70, 0x0B,
            0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x92, 0x0B, 0x07, 0x00, 0x20, 0x00,
            0x20, 0x01, 0x93, 0x0B, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x94, 0x0B,
            0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x95, 0x0B
        ]);

        const wasm = await WebAssembly.compile(data);
        const instance = await WebAssembly.instantiate(wasm, {});

        this._exports = instance.exports as unknown as InterpreterWasmExport;
    }

    private getFloatingPointValue(arrayBuffer: ArrayBuffer): number
    {
        if (arrayBuffer instanceof Uint32Array || arrayBuffer instanceof Int32Array)
        {
            return new DataView(arrayBuffer.buffer).getFloat32(0, true);
        }
        else if (arrayBuffer instanceof Float32Array)
        {
            return arrayBuffer[0];
        }
        else
        {
            throw new Error("Unknown datatype to convert to floating point value.");
        }
    }

    private getIntegerValue(arrayBuffer: ArrayBuffer): number
    {
        if (arrayBuffer instanceof Uint32Array || arrayBuffer instanceof Int32Array || arrayBuffer instanceof Float32Array)
        {
            return new DataView(arrayBuffer.buffer).getInt32(0, true);
        }
        else
        {
            throw new Error("Unknown datatype to convert to floating point value.");
        }
    }

    private getUnsignedIntegerValue(arrayBuffer: ArrayBuffer): number
    {
        if (arrayBuffer instanceof Uint32Array || arrayBuffer instanceof Int32Array || arrayBuffer instanceof Float32Array)
        {
            return new DataView(arrayBuffer.buffer).getUint32(0, true);
        }
        else
        {
            throw new Error("Unknown datatype to convert to floating point value.");
        }
    }

    private jumpToLocation(instruction: InterpreterInstruction, location: InterpreterLocation)
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

        const address = this._labels.get(label);

        if (this._memoryRegions.get(label))
            throw instruction.error(location, "Cannot jump to a memory location.");

        if (!address)
            throw instruction.error(location, "Invalid label location provided.");

        this.jumpToLocationByAddress(instruction, address.lineNumber);
    }

    private jumpToLocationByAddress(instruction: InterpreterInstruction, address: number)
    {
        if (address < 0 || address > this._instructions.length)
            throw instruction.error(InterpreterLocation.Operand, "Address is out of bounds.");

        this._programCounter = address;
        this._didModifyProgramCounter = true;
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
            return new Uint32Array([ memoryLocation.address ]);
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

        this._labels.forEach((address_, label_) =>
        {
            if (address_.address === address)
            {
                label = label_;
            }
        });

        if (!label)
        {
            throw instruction.error(InterpreterLocation.Operand, "Unable to resolve line number to a label.");
        }

        ////////////////////////////////////////////////////////////

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

        this._labels.forEach((address_, label_) =>
        {
            if (address_.address === address)
            {
                label = label_;
            }
        });

        if (!label)
        {
            throw instruction.error(InterpreterLocation.Operand, "Unable to resolve line number to a label.");
        }

        ////////////////////////////////////////////////////////////

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

    private popValue(instruction: InterpreterInstruction): ArrayBuffer
    {
        const value = this._stack.pop();

        if (!value)
        {
            throw instruction.error(InterpreterLocation.Operand, "Stack was empty.")
        }

        return value.slice(0);
    }

    private processMemoryRegions()
    {
        this._labels.forEach((location, label) =>
        {
            if (location.lineNumber in this._instructions)
            {
                const instruction = new InterpreterInstruction(this._instructions[location.lineNumber], location.lineNumber );

                if (instruction.arg0 && instruction.operand === ".data")
                {
                    this._memoryRegions.set(label, this.getNumericValue(instruction, InterpreterLocation.Arg0));
                }
            }
        });
    }

    private processLabels()
    {
        let addressCount = 0;

        for (let i = 0; i < this._instructions.length; i++)
        {
            const line = this._instructions[i];
            const instruction = new InterpreterInstruction(line, i);

            if (
                instruction.operand === "HALT" ||
                instruction.operand === "GETAVB" ||
                instruction.operand === "GETA" ||
                instruction.operand === "GETB" ||
                instruction.operand === "VGETA" ||
                instruction.operand === "VGETB" ||
                instruction.operand === "PUSH" ||
                instruction.operand === "VPUSH" ||
                instruction.operand === "SAVEPUSH" ||
                instruction.operand === "MOVOUTPUSH" ||
                instruction.operand === "POP" ||
                instruction.operand === "GETPOPA" ||
                instruction.operand === "GETPOPB" ||
                instruction.operand === "GETPOPR" ||
                instruction.operand === "POPNOP" ||
                instruction.operand === "MOVINPOP" ||
                instruction.operand === "SAVE" ||
                instruction.operand === "SAVEA" ||
                instruction.operand === "SAVEB" ||
                instruction.operand === "SAVETOA" ||
                instruction.operand === "SAVETOB" ||
                instruction.operand === "JA" ||
                instruction.operand === "JNA" ||
                instruction.operand === "JMP" ||
                instruction.operand === "CALL" ||
                instruction.operand === "RTN" ||
                instruction.operand === "MOV" ||
                instruction.operand === "MOVIN" ||
                instruction.operand === "MOVOUT" ||
                instruction.operand === "ADD" ||
                instruction.operand === "FADD" ||
                instruction.operand === "SADD" ||
                instruction.operand === "MULT" ||
                instruction.operand === "FMULT" ||
                instruction.operand === "SMULT" ||
                instruction.operand === "DIV" ||
                instruction.operand === "FDIV" ||
                instruction.operand === "SDIV" ||
                instruction.operand === "SUB" ||
                instruction.operand === "FSUB" ||
                instruction.operand === "SSUB" ||
                instruction.operand === "CMPE" ||
                instruction.operand === "CMPNE" ||
                instruction.operand === "CMPLT" ||
                instruction.operand === "CMPLTE" ||
                instruction.operand === "CMPGT" ||
                instruction.operand === "CMPGTE" ||
                instruction.operand === "SCMPE" ||
                instruction.operand === "SCMPNE" ||
                instruction.operand === "SCMPLT" ||
                instruction.operand === "SCMPLTE" ||
                instruction.operand === "SCMPGT" ||
                instruction.operand === "SCMPGTE" ||
                instruction.operand === "FCMPE" ||
                instruction.operand === "FCMPNE" ||
                instruction.operand === "FCMPLT" ||
                instruction.operand === "FCMPLTE" ||
                instruction.operand === "FCMPGT" ||
                instruction.operand === "FCMPGTE" ||
                instruction.operand === "NEG" ||
                instruction.operand === "SNEG" ||
                instruction.operand === "FNEG" ||
                instruction.operand === "INC" ||
                instruction.operand === "DEC" ||
                instruction.operand === "FINC" ||
                instruction.operand === "FDEC" ||
                instruction.operand === "REM" ||
                instruction.operand === "AND" ||
                instruction.operand === "SHIFTL" ||
                instruction.operand === "SHIFTR" ||
                instruction.operand === "OR" ||
                instruction.operand === "XOR" ||
                instruction.operand === "NOT" ||
                instruction.operand === "FLTOINT" ||
                instruction.operand === "INTTOFL" ||
                instruction.operand === "LAND" ||
                instruction.operand === "LOR" ||
                instruction.operand === "QADD" ||
                instruction.operand === "QSUB" ||
                instruction.operand === "QLADD" ||
                instruction.operand === "QLSUB" ||
                instruction.operand === "QSTORE" ||
                instruction.operand === "TICK" ||
                instruction.operand === "RAND" ||
                instruction.operand === "SETLED" ||
                instruction.operand === ".data"
            )
            {
                addressCount += 1;
            }
            else if (
                instruction.operand === "STORE" ||
                instruction.operand === "STOREPUSH"
            )
            {
                addressCount += 2;
            }
            else if (line.endsWith(":"))
            {
                this._labels.set(
                    line.replace(":", ""),
                    new InterpreterLabel(addressCount, i + 1)
                );
            }
        }
    }

    private processInstructions()
    {
        let isRunning = true;

        while (isRunning)
        {
            const instruction = new InterpreterInstruction(this._instructions[this._programCounter], this._programCounter);

            this._didModifyProgramCounter = false;

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
                else if (
                    instruction.operand === "JA" ||
                    instruction.operand === "JNA" ||
                    instruction.operand === "JMP" ||
                    instruction.operand === "CALL" ||
                    instruction.operand === "RTN"
                )
                {
                    this.interpretJUMP(instruction);
                }
                else if (
                    instruction.operand === "MOV" ||
                    instruction.operand === "MOVIN" ||
                    instruction.operand === "MOVOUT"
                )
                {
                    this.interpretMOVE(instruction);
                }
                else if (
                    instruction.operand === "ADD" ||
                    instruction.operand === "FADD" ||
                    instruction.operand === "SADD" ||
                    instruction.operand === "MULT" ||
                    instruction.operand === "FMULT" ||
                    instruction.operand === "SMULT" ||
                    instruction.operand === "DIV" ||
                    instruction.operand === "FDIV" ||
                    instruction.operand === "SDIV" ||
                    instruction.operand === "SUB" ||
                    instruction.operand === "FSUB" ||
                    instruction.operand === "SSUB" ||

                    instruction.operand === "CMPE" ||
                    instruction.operand === "CMPNE" ||
                    instruction.operand === "CMPLT" ||
                    instruction.operand === "CMPLTE" ||
                    instruction.operand === "CMPGT" ||
                    instruction.operand === "CMPGTE" ||

                    instruction.operand === "SCMPE" ||
                    instruction.operand === "SCMPNE" ||
                    instruction.operand === "SCMPLT" ||
                    instruction.operand === "SCMPLTE" ||
                    instruction.operand === "SCMPGT" ||
                    instruction.operand === "SCMPGTE" ||

                    instruction.operand === "FCMPE" ||
                    instruction.operand === "FCMPNE" ||
                    instruction.operand === "FCMPLT" ||
                    instruction.operand === "FCMPLTE" ||
                    instruction.operand === "FCMPGT" ||
                    instruction.operand === "FCMPGTE" ||

                    instruction.operand === "NEG" ||
                    instruction.operand === "SNEG" ||
                    instruction.operand === "FNEG" ||

                    instruction.operand === "INC" ||
                    instruction.operand === "DEC" ||
                    instruction.operand === "FINC" ||
                    instruction.operand === "FDEC" ||

                    instruction.operand === "REM" ||
                    instruction.operand === "AND" ||
                    instruction.operand === "SHIFTL" ||
                    instruction.operand === "SHIFTR" ||

                    instruction.operand === "OR" ||
                    instruction.operand === "XOR" ||
                    instruction.operand === "NOT" ||

                    instruction.operand === "FLTOINT" ||
                    instruction.operand === "INTTOFL" ||
                    instruction.operand === "LAND" ||
                    instruction.operand === "LOR"
                )
                {
                    this.interpretCOMPUTE(instruction);
                }
                else if (
                    instruction.operand === "QADD" ||
                    instruction.operand === "QSUB" ||
                    instruction.operand === "QLADD" ||
                    instruction.operand === "QLSUB" ||
                    instruction.operand === "QSTORE" ||
                    instruction.operand === "STORE"
                )
                {
                    this.interpretSTORE(instruction);
                }
                else if (
                    instruction.operand === "TICK" ||
                    instruction.operand === "RAND" ||
                    instruction.operand === "GETAVB" ||
                    instruction.operand === "SETLED"
                )
                {
                    this.interpretSPECIAL(instruction);
                }
                else if (instruction.operand === "#") {}
                else if (this._instructions[this._programCounter].endsWith(":")) {}
                else
                {
                    throw instruction.error(InterpreterLocation.Operand, "Unimplemented instruction '" + instruction.operand + "'.")
                }
            }

            if (!this._didModifyProgramCounter)
            {
                this._programCounter++;
            }
        }
    }

    // Implement InstructionVGETA.ts
    // Implement InstructionVGETB.ts
    // Implement InstructionGETA.ts
    // Implement InstructionGETB.ts
    private interpretGET(instruction: InterpreterInstruction)
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
    private interpretPUSH(instruction: InterpreterInstruction)
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
    private interpretPOP(instruction: InterpreterInstruction)
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
    private interpretSAVE(instruction: InterpreterInstruction)
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

    // Implement InstructionJA.ts
    // Implement InstructionJNA.ts
    // Implement InstructionJMP.ts
    // Implement InstructionCALL.ts
    // Implement InstructionRTN.ts
    private interpretJUMP(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "JA")
        {
            if (this.getUnsignedIntegerValue(this._registerA) != 0)
            {
                this.jumpToLocation(instruction, InterpreterLocation.Arg0);
            }
        }
        else if (instruction.operand === "JNA")
        {
            if (this.getUnsignedIntegerValue(this._registerA) == 0)
            {
                this.jumpToLocation(instruction, InterpreterLocation.Arg0);
            }
        }
        else if (instruction.operand === "JMP")
        {
            this.jumpToLocation(instruction, InterpreterLocation.Arg0);
        }
        else if (instruction.operand === "RTN")
        {
            const poppedLineNumber = this._callStack.pop();

            if (!poppedLineNumber)
                throw instruction.error(InterpreterLocation.Operand, "Call stack is empty.");

            this.jumpToLocationByAddress(instruction, poppedLineNumber);
        }
        else if (instruction.operand === "CALL")
        {
            this._callStack.push(this._programCounter + 1);

            this.jumpToLocation(instruction, InterpreterLocation.Arg0);
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for JUMP-like instruction.");
        }
    }

    // Implement InstructionMOV.ts
    // Implement InstructionMOVIN.ts
    // Implement InstructionMOVOUT.ts
    private interpretMOVE(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "MOV")
        {
            this.setMemoryNumericValue(
                instruction,
                InterpreterLocation.Arg1,
                this.getMemoryValue(instruction, InterpreterLocation.Arg0)
            );
        }
        else if (instruction.operand === "MOVIN")
        {
            const value = this.getMemoryValue(instruction, InterpreterLocation.Arg0);
            const address = new Uint32Array(this._registerR)[0];

            this.setMemoryNumericValueByAddress(instruction, address, value);
        }
        else if (instruction.operand === "MOVOUT")
        {
            const value = this.getMemoryNumericValueByAddress(instruction, new Uint32Array(this._registerR)[0]);

            this.setMemoryNumericValue(instruction, InterpreterLocation.Arg0, value);
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for MOVE-like instruction.");
        }
    }

    // Implement InstructionADD.ts
    // Implement InstructionMULT.ts
    // Implement InstructionDIV.ts
    // Implement InstructionSUB.ts
    // Implement InstructionCMP.ts

    // Implement InstructionNEG.ts
    // Implement InstructionFNEG.ts
    // Implement InstructionSNEG.ts

    // Implement InstructionINC.ts
    // Implement InstructionDEC.ts
    // Implement InstructionFINC.ts
    // Implement InstructionFDEC.ts

    // Implement InstructionREM.ts

    // Implement InstructionAND.ts
    // Implement InstructionNOT.ts
    // Implement InstructionOR.ts
    // Implement InstructionXOR.ts

    // Implement InstructionSHIFTL.ts
    // Implement InstructionSHIFTR.ts

    // Implement InstructionFLTOINT.ts
    // Implement InstructionINTTOFL.ts
    // Implement InstructionLAND.ts
    // Implement InstructionLOR.ts

    private interpretCOMPUTE(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "SADD")
            this._registerR = new Int32Array([ this._exports.add(this.getIntegerValue(this._registerA), this.getIntegerValue(this._registerB)) ]);
        else if (instruction.operand === "FADD")
            this._registerR = new Float32Array([ this._exports.fadd(this.getFloatingPointValue(this._registerA), this.getFloatingPointValue(this._registerB)) ]);
        else if (instruction.operand === "ADD")
            this._registerR = new Uint32Array([ this._exports.add(this.getUnsignedIntegerValue(this._registerA), this.getUnsignedIntegerValue(this._registerB)) ]);

        else if (instruction.operand === "SSUB")
            this._registerR = new Int32Array([ this._exports.sub(this.getIntegerValue(this._registerA), this.getIntegerValue(this._registerB)) ]);
        else if (instruction.operand === "FSUB")
            this._registerR = new Float32Array([ this._exports.fsub(this.getFloatingPointValue(this._registerA), this.getFloatingPointValue(this._registerB)) ]);
        else if (instruction.operand === "SUB")
            this._registerR = new Uint32Array([ this._exports.sub(this.getUnsignedIntegerValue(this._registerA), this.getUnsignedIntegerValue(this._registerB)) ]);

        else if (instruction.operand === "SDIV")
            this._registerR = new Int32Array([ this._exports.idiv(this.getIntegerValue(this._registerA), this.getIntegerValue(this._registerB)) ]);
        else if (instruction.operand === "FDIV")
            this._registerR = new Float32Array([ this._exports.fdiv(this.getFloatingPointValue(this._registerA), this.getFloatingPointValue(this._registerB)) ]);
        else if (instruction.operand === "DIV")
            this._registerR = new Uint32Array([ this._exports.udiv(this.getUnsignedIntegerValue(this._registerA), this.getUnsignedIntegerValue(this._registerB)) ]);

        else if (instruction.operand === "SMULT")
            this._registerR = new Int32Array([ this._exports.mul(this.getIntegerValue(this._registerA), this.getIntegerValue(this._registerB)) ]);
        else if (instruction.operand === "FMULT")
            this._registerR = new Float32Array([ this._exports.fmul(this.getFloatingPointValue(this._registerA), this.getFloatingPointValue(this._registerB)) ]);
        else if (instruction.operand === "MULT")
            this._registerR = new Uint32Array([
                this._exports.mul(this.getUnsignedIntegerValue(this._registerA), this.getUnsignedIntegerValue(this._registerB))
            ]);

        else if (instruction.operand === "CMPE")
            this._registerR = new Uint32Array(
                [ this.getUnsignedIntegerValue(this._registerA) == this.getUnsignedIntegerValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "CMPNE")
            this._registerR = new Uint32Array(
                [ this.getUnsignedIntegerValue(this._registerA) != this.getUnsignedIntegerValue(this._registerB)  ? 1 : 0 ]);
        else if (instruction.operand === "CMPGT")
            this._registerR = new Uint32Array(
                [ this.getUnsignedIntegerValue(this._registerA) > this.getUnsignedIntegerValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "CMPGTE")
                    this._registerR = new Uint32Array(
                        [ this.getUnsignedIntegerValue(this._registerA) >= this.getUnsignedIntegerValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "CMPLT")
                    this._registerR = new Uint32Array(
                        [ this.getUnsignedIntegerValue(this._registerA) < this.getUnsignedIntegerValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "CMPLTE")
            this._registerR = new Uint32Array(
                [ this.getUnsignedIntegerValue(this._registerA) <= this.getUnsignedIntegerValue(this._registerB) ? 1 : 0 ]);

        else if (instruction.operand === "SCMPE")
            this._registerR = new Uint32Array(
                [ this.getIntegerValue(this._registerA) == this.getIntegerValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "SCMPNE")
            this._registerR = new Uint32Array(
                [ this.getIntegerValue(this._registerA) != this.getIntegerValue(this._registerB)  ? 1 : 0 ]);
        else if (instruction.operand === "SCMPGT")
            this._registerR = new Uint32Array(
                [this.getIntegerValue(this._registerA) > this.getIntegerValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "SCMPGTE")
            this._registerR = new Uint32Array(
                [this.getIntegerValue(this._registerA) >= this.getIntegerValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "SCMPLT")
            this._registerR = new Uint32Array(
                [this.getIntegerValue(this._registerA) < this.getIntegerValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "SCMPLTE")
            this._registerR = new Uint32Array(
                [this.getIntegerValue(this._registerA) <= this.getIntegerValue(this._registerB) ? 1 : 0]);

        else if (instruction.operand === "FCMPE")
            this._registerR = new Uint32Array(
                [ this.getFloatingPointValue(this._registerA) == this.getFloatingPointValue(this._registerB) ? 1 : 0 ]);
        else if (instruction.operand === "FCMPNE")
            this._registerR = new Uint32Array(
                [ this.getFloatingPointValue(this._registerA) != this.getFloatingPointValue(this._registerB)  ? 1 : 0 ]);
        else if (instruction.operand === "FCMPGT")
            this._registerR = new Uint32Array(
                [this.getFloatingPointValue(this._registerA) > this.getFloatingPointValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "FCMPGTE")
            this._registerR = new Uint32Array(
                [this.getFloatingPointValue(this._registerA) >= this.getFloatingPointValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "FCMPLT")
            this._registerR = new Uint32Array(
                [this.getFloatingPointValue(this._registerA) < this.getFloatingPointValue(this._registerB) ? 1 : 0]);
        else if (instruction.operand === "FCMPLTE")
            this._registerR = new Uint32Array(
                [this.getFloatingPointValue(this._registerA) <= this.getFloatingPointValue(this._registerB) ? 1 : 0]);

        else if (instruction.operand === "NEG")
            this._registerR = new Uint32Array(
                [ this.getUnsignedIntegerValue(this._registerA) != 0 ? 0 : 1 ]);
        else if (instruction.operand === "SNEG")
            this._registerR = new Int32Array([ -this.getIntegerValue(this._registerA) ]);
        else if (instruction.operand === "FNEG")
            this._registerR = new Float32Array([ -this.getFloatingPointValue(this._registerA) ]);

        else if (instruction.operand === "INC")
            this._registerR = new Int32Array([ this.getIntegerValue(this._registerA) + 1 ]);
        else if (instruction.operand === "DEC")
            this._registerR = new Int32Array([ this.getIntegerValue(this._registerA) - 1 ]);
        else if (instruction.operand === "FINC")
            this._registerR = new Float32Array([ this.getFloatingPointValue(this._registerA) + 1 ]);
        else if (instruction.operand === "FDEC")
            this._registerR = new Float32Array([ this.getFloatingPointValue(this._registerA) - 1 ]);


        else if (instruction.operand === "REM")
            this._registerR = new Uint32Array([ this._exports.rem(this.getUnsignedIntegerValue(this._registerA), this.getUnsignedIntegerValue(this._registerB)) ]);


        else if (instruction.operand === "AND")
            this._registerR = new Uint32Array([this.getUnsignedIntegerValue(this._registerA) & this.getUnsignedIntegerValue(this._registerB)]);
        else if (instruction.operand === "SHIFTL")
            this._registerR = new Uint32Array([this.getUnsignedIntegerValue(this._registerA) << this.getUnsignedIntegerValue(this._registerB)]);
        else if (instruction.operand === "SHIFTR")
            this._registerR = new Uint32Array([this.getUnsignedIntegerValue(this._registerA) >>> this.getUnsignedIntegerValue(this._registerB)]);

        else if (instruction.operand === "NOT")
            this._registerR = new Uint32Array([~this.getUnsignedIntegerValue(this._registerA)]);
        else if (instruction.operand === "OR")
            this._registerR = new Uint32Array([this.getUnsignedIntegerValue(this._registerA) | this.getUnsignedIntegerValue(this._registerB)]);
        else if (instruction.operand === "XOR")
            this._registerR = new Uint32Array([this.getUnsignedIntegerValue(this._registerA) ^ this.getUnsignedIntegerValue(this._registerB)]);

        else if (instruction.operand === "FLTOINT")
            this._registerR = new Int32Array([ this.getFloatingPointValue(this._registerA) ]);
        else if (instruction.operand === "INTTOFL")
            this._registerR = new Float32Array([ this.getIntegerValue(this._registerA) ]);

        else if (instruction.operand === "LAND")
            this._registerR = new Uint32Array([
                (this.getUnsignedIntegerValue(this._registerA) != 0 && this.getUnsignedIntegerValue(this._registerB) != 0) ? 1 : 0
            ]);
        else if (instruction.operand === "LOR")
            this._registerR = new Uint32Array([
                (this.getUnsignedIntegerValue(this._registerA) != 0 || this.getUnsignedIntegerValue(this._registerB) != 0) ? 1 : 0
            ]);


        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for COMPUTE-like instruction.");
        }
    }

    // Implement InstructionQADD.ts
    // Implement InstructionQSUB.ts
    // Implement InstructionQLADD.ts
    // Implement InstructionQLSUB.ts
    // Implement InstructionQSTORE.ts
    // Implement InstructionSTORE.ts
    private interpretSTORE(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "QADD" || instruction.operand === "QSUB")
        {
            const valueA = this.getNumericValue(instruction, InterpreterLocation.Arg0);
            const valueB = this.getNumericValue(instruction, InterpreterLocation.Arg1);

            let fn = this._exports.add;

            if (instruction.operand === "QSUB")
                fn = this._exports.sub;

            this._registerR = new Int32Array( [ fn(this.getIntegerValue(valueA), this.getIntegerValue(valueB)) ]);
        }
        else if (instruction.operand === "QLADD" || instruction.operand === "QLSUB")
        {
            const valueA = this.getMemoryValue(instruction, InterpreterLocation.Arg0);
            const valueB = this.getNumericValue(instruction, InterpreterLocation.Arg1);

            let fn = this._exports.add;

            if (instruction.operand === "QLSUB")
                fn = this._exports.sub;

            this._registerR = new Int32Array( [ fn(this.getIntegerValue(valueA), this.getIntegerValue(valueB)) ]);
        }

        else if (instruction.operand === "STORE" || instruction.operand === "QSTORE")
        {
            this.setMemoryValue(instruction, InterpreterLocation.Arg1, InterpreterLocation.Arg0);
        }
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for STORE-like instruction.");
        }
    }

    // Implement InstructionRAND.ts
    // Implement InstructionSETLED.ts
    // Implement InstructionTICK.ts
    // Implement InstructionGETAVB.ts
    private interpretSPECIAL(instruction: InterpreterInstruction)
    {
        if (instruction.operand === "RAND")
        {
            const getRandomNumber = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            this._registerR = new Uint32Array([ getRandomNumber(0, 4294967295) ]);
        }
        else if (instruction.operand === "GETAVB")
        {
            const valueA = this.getMemoryValue(instruction, InterpreterLocation.Arg0);
            const valueB = this.getNumericValue(instruction, InterpreterLocation.Arg1);

            this._registerA = valueA;
            this._registerB = valueB;
        }
        else if (instruction.operand === "SETLED" || instruction.operand === "TICK") {}
        else
        {
            instruction.error(InterpreterLocation.Operand, "Unknown operand for SPECIAL-like instruction.");
        }
    }
}

enum InterpreterLocation {
    Operand,
    Arg0,
    Arg1
}

class InterpreterLabel
{
    constructor(public readonly address: number, public readonly lineNumber: number)
    {
    }
}

class InterpreterWasmExport
{
    public readonly add: (x: number, y: number) => number;
    public readonly sub: (x: number, y: number) => number;
    public readonly mul: (x: number, y: number) => number;
    public readonly rem: (x: number, y: number) => number;
    public readonly idiv: (x: number, y: number) => number;
    public readonly udiv: (x: number, y: number) => number;

    public readonly fadd: (x: number, y: number) => number;
    public readonly fsub: (x: number, y: number) => number;
    public readonly fmul: (x: number, y: number) => number;
    public readonly fdiv: (x: number, y: number) => number;
}

class InterpreterInstruction
{
    private _instructionParts: string[];

    constructor(private _instruction: string, private _lineNumber: number)
    {
        this._instructionParts = _instruction.split(" ");
    }

    get lineNumber()
    {
        return this._lineNumber;
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
                return this.generateError(this._instruction, this._lineNumber, this._instructionParts[0].length + this._instructionParts[1].length + 2, this._instructionParts[2].length - 1, message);
        }
    }

    private generateError(line: string, lineNumber: number, start: number, end: number, message: string): Error
    {
        let buffer = String();

        buffer += `line ${lineNumber + 1}: ${message}\n`;
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
