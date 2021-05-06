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
        
        int a[2];   
        int r = 1;
        int c = ++a[r - 1] + (r + 2);
       
      

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