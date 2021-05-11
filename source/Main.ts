import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        int main()
        {
            float a = 2.f;
  
            return (int)a;
        }

        int result = main();
        `));
    }
}

Main.start();