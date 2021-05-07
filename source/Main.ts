import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        struct Munchies {
            float cookieness;
        };

        struct Hello {
            int data;
            Munchies cookie;
        };
        
        Hello a;
        int c = a.cookie.cookieness;
       
      

        // void test(const int fff)
        // {
        //     int a = 2;
        //    
        //     return a;
        // }
        
        
        `);
    }
}

Main.start();