import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint sqrt(int x) 
        {
            int s = 0;
            uint r = 12;
            
            
            s += r;
        } 

        `));
    }
}

Main.start();