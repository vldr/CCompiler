import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        void lastPosition(int n, int m, int k)
{
    int x;


    if (x)
    {

    }
}
 
        `));

        //interpreter.run();

    }
}

Main.start();