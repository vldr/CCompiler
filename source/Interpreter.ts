export default class Interpreter
{
    private _registerA = new ArrayBuffer(1);
    private _registerB = new ArrayBuffer(1);
    private _registerR = new ArrayBuffer(1);
    private _stack = new Array<ArrayBuffer>();
    private _labels = new Map<string, number>();
    private _memoryRegions = new Map<string, number>();
    private _instructions: Array<string>;
    private _programCounter = 0;

    constructor(public readonly content: string)
    {
        this._instructions = content
            .split("\n")
            .map((line) => line.replace("\n", "").trim());
    }

    public run()
    {
        console.log(this.content);

        this.processLabels();
        this.processInstructions();
    }

    private processLabels()
    {
        for (let i = 0; i < this._instructions.length; i++)
        {
            let line = this._instructions[i];
            const lineNumber = i + 1;

            if (line.length)
            {
                if (line.endsWith(":"))
                {
                    line = line.replace(":", "");

                    if (line.length === 0)
                    {
                        throw this.generateError(line, lineNumber, 0, line.length - 1, "Labels cannot be empty.");
                    }

                    if (line.includes(" "))
                    {
                        throw this.generateError(line, lineNumber, 0, line.length - 1, "Labels cannot contain spaces within them.");
                    }

                    this._labels.set(line, i + 1);
                }
            }
        }
    }

    private processInstructions()
    {
        let isRunning = true;

        while (isRunning)
        {
            const instruction = this._instructions[this._programCounter];
            const instructionParts = instruction.split(" ");

            if (instructionParts.length > 0)
            {
                const lineNumber = this._programCounter;

                const operand: string = instructionParts[0];
                const arg0: string | undefined = instructionParts.length > 1 ? instructionParts[1] : undefined;
                const arg1: string | undefined = instructionParts.length > 2 ? instructionParts[2] : undefined;

                const operandError = (msg: string) => this.generateError(instruction, this._programCounter, 0, instructionParts[0].length - 1, msg);
                const arg0Error = (msg: string) => this.generateError(instruction, this._programCounter, instructionParts[0].length + 1, instructionParts[1].length - 1, msg);
                const arg1Error = (msg: string) => this.generateError(instruction, this._programCounter, instructionParts[1].length + 1, instructionParts[2].length - 1, msg);

                switch (operand)
                {
                    case "GETA": {

                        break;
                    }
                    case "GETB": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    case "GETA": {

                        break;
                    }
                    default:
                        throw arg0Error("Unsupported operand by the interpreter.");
                }
            }
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
    // TODO: Implement InstructionGETA.ts
    // TODO: Implement InstructionGETB.ts
    // TODO: Implement InstructionGETPOPA.ts
    // TODO: Implement InstructionGETPOPB.ts
    // TODO: Implement InstructionGETPOPR.ts
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
    // TODO: Implement InstructionPOP.ts
    // TODO: Implement InstructionPOPNOP.ts
    // TODO: Implement InstructionPUSH.ts
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