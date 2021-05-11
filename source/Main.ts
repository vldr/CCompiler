import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        struct Test {
            int a[10];
        };
        
        Test test;
        
        int sqrt(int x) 
        {
            _push(x * 2);
            
            int a = _pop_int() + 1.f;
            
            return a;
        } 
        
        int r = sqrt(10);

        `));
    }
}

Main.start();