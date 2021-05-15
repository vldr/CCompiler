import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        const interpreter = new Interpreter(compiler.compile(`
        uint z1yguyguygvuyguy = 687u;
        uint b = z1yguyguygvuyguy + 3u;
        
        void main() {
            z1yguyguygvuyguy = ((z1yguyguygvuyguy & 4294967294u) << 18u) ^ b;
        }
        
        main();
        `))

        interpreter.run();

    }
}

Main.start();