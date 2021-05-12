import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
       float MAX_RAND = (float)0x4f800000u;
        `));
    }
}

Main.start();