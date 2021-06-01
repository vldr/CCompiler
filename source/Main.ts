import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static async start()
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
              float sqrt(float n) 
{ 
    float x = n; 
    float y = 1.0; 
    float e = 0.000001;

    while (x - y > e) 
    { 
        x = (x + y) / 2.0;
        y = n / x;
    } 

    return x; 
} 

float run()
{
    float n, i, j;
    float f;
    float pi = 1.0;

    n = 100.0; 
    for(i = n; i > 1.0; i--) {
        f = 2.0;
        for(j = 1.0; j < i; j++){
            f = 2.0 + sqrt(f);
        }
        f = sqrt(f);
        pi = pi * f / 2.0;
    }
    pi *= sqrt(2.0) / 2.0;
    pi = 2.0 / pi;

    return pi;
}
float result = run();
        `);

        console.log(result);

        const interpreter = new Interpreter(result);
        await interpreter.run();

        console.log(interpreter.memoryRegions)

    }
}

Main.start();