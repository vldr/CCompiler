import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
        int a = 10;
        int f = 5;
        int r = f + a;
 
        `);
        //console.log(result);

        new Interpreter(`
            VGETB -3
            GETA var_a
            HALT
            
            var_a:
            .data 10.25f
            .read var_a var_a
            var_f:
            .data 5
            .read var_f var_f
            var_r:
            .data 0
            .read var_r var_r

        `).run();

    }
}

Main.start();