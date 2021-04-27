import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        Logger.log(new Compiler().compile(`
        int hello(int a)
        {
            return a * 2.2 + 2;
        }
        
        int a = hello();
        
        float cool()
        {
            return 1.f;
        }
        
        float c = cool();    
        `));
    }
}

Main.start();