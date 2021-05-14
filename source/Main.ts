import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint z1 = 687u;
        uint b = 2u;
        
        void main() {
            z1 = ((z1 & 4294967294u) << 18u) ^ b;
        }
       
        `));
    }
}

Main.start();