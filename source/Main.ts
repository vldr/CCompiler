import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start()
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
            void test()
            {
                int a[2];
                a[0];
            }
        `);

        const interpreter = new Interpreter(result);
        //await interpreter.run();
        console.log(result);
    }
}

Main.start();