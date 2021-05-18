import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        //console.log(result);

        // const compiler = new Compiler();
        // const result = compiler.compile(`
        // int a = 10;
        // int f = 5;
        // int r = f + a;
        //
        // `);

        new Interpreter(`
            MOV var_a var_b
            HALT
            
            var_a:
            .data 16
            
            var_b:
            .data 0

        `).run();
    }
}

Main.start();