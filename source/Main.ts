import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start()
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
        uint is_multiple_of_3(int n) 
{ 
    int odd_count = 0; 
    int even_count = 0; 
  
    if (n < 0) 
        n = -n; 

    if (n == 0) 
        return 1u; 

    if (n == 1) 
        return 0u; 
  
    while (n) 
    { 
        if (n & 1) 
            odd_count = odd_count + 1; 

        if (n & 2) 
            even_count = even_count + 1; 

        n >>= 2; 
    } 
    
    int a = odd_count - even_count;

    if (a < 0)
    {
        a = -a;
    }

    return is_multiple_of_3(a); 
} 

_load_a(is_multiple_of_3(5463));
        `);

        const interpreter = new Interpreter(result);
        //await interpreter.run();
        console.log(result);
    }
}

Main.start();