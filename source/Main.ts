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
            int s = 0, b = 32768; 
           
        
            while (b)  
            { 
                int t = (s + b); 
                if (t * t <= x) s = t; 
                b >>= 1;
            }
        
            return (uint)s; 
        } 

        `));
    }
}

Main.start();