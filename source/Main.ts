import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint lastPosition(uint n, uint m, uint k)
        {
            /*if (m <= n - k + 1)
                return m + k - 1;
        
            m = m - (n - k + 1);*/
        
            return (m % n == 0u) ? n : (m % n);
        }
        `));

        //interpreter.run();

    }
}

Main.start();