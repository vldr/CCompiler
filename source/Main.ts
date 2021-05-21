import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static async start()
    {

        const compiler = new Compiler();
        const result = compiler.compile(`
            
        `);

        const interpreter = new Interpreter(result);
        interpreter.run();

        //console.log(result);

        // @ts-ignore
        //console.log(interpreter.memoryRegions.get("var_answer"));
    }
}

Main.start();