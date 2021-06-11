import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start()
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
            int array[] = {
                55
            };
            
            void swap(int i, int j) 
            {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        `);

        const interpreter = new Interpreter(result);
        //await interpreter.run();
        console.log(result);
    }
}

Main.start();