import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        void sqrt(int x) 
        {
            int a = x > 0 ? 1 : 0;
        } 
        
        sqrt(10);
        `));
    }
}

Main.start();