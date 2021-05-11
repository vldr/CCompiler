import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        struct Munchies
        { 
            int cookieness[3];
        };
        
        int r[2];
        Munchies m;
        
        int main()
        {
            return -r.length;
        }

        int result = main();
        `));
    }
}

Main.start();