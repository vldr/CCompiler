import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint main(float x)
        {
            const float COMPARATOR = 2.f;
            x = 12.f;

            if (x > 1.f) {
                while (x > 12.f)
                {
                    if (x > 1.f)
                    {
                        x += 0.f;
                        return true;
                    }
                    
                    
                }
            } else { return true; } 
                
            return true;
        }
       
        `));
    }
}

Main.start();