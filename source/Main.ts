import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
        int a[2];
        int b = a[4];
        `);

        const interpreter = new Interpreter(result);
        interpreter.run();
    }
}

Main.start();