import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        struct Munchies {
            float cookieness;
            int rookies;
        };

        struct Hello {
            float data;
            Munchies cookie;
        };
        
        int c = 1;
        Hello a[2];
        int k = a[c].cookie.rookies;
       
      

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