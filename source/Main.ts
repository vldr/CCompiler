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
            VPUSH var_b
            
            VPUSH 128
            VPUSH 64
            VPUSH 32
            
            VPUSH 16
            
            POP var_a
            
            GETPOPA
            GETPOPB
            GETPOPR
            
            MOVINPOP

            HALT
            
            var_a:
            .data 0
            
            var_b:
            .data 0

        `).run();
    }
}

Main.start();