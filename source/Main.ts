import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint g_seed = _urand();
        
        int rand() {
            g_seed = (214013u * g_seed + 2531011u);
            int result[] = { 1, (int)(g_seed >>= 16u) };
        
            /*if (result < 0)
                result *= -1;*/
        
            return 1;
        }

 
        `));

        //interpreter.run();

    }
}

Main.start();