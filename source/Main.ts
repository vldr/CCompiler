import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        void main(float x)
        {
            for (int i = 0; i < 10; i++)
            {
                if (i == 5)
                    continue;
                else if (i == 8)
                    break;
                    
                x++;
            }
        }
       
        `));
    }
}

Main.start();