import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        int hello(int a)
        {
            return a * 2.2 + 2;
        }
        
        int b = 12;
        const int a = hello();
        int a[2];
        
        float cool()
        {
            return 1.f;
        }
        
        float c = cool();    
        `);
    }
}

Main.start();