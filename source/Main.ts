import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        // struct Munchies {
        //     float cookieness;
        // };
        //
        // struct Hello {
        //     int data;
        //     Munchies cookie;
        // };
        //
        // const float f = 328.748;
        // const float ii = 1.52 - (2 + f);
        
        float af = 40;
        float afff = 1 + (af-- + af);
        
        int test(int fff)
        {
            return 0;
        }

     
        
        
        //int a = 222;
        
        //int iihuhu = 1 + a;
        
        
        `);
    }
}

Main.start();