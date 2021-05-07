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
            float data;
            Munchies cookie;
        };
        
        Hello a;
        float c = a.cookie.cookieness + a.data;
       
      

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