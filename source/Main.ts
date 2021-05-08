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

        struct SuperCookie {
            Munchies superness[2];
            Munchies cookie;
        };
        
        int coolio = 0;
        SuperCookie a[2];
        int k = (a[1].superness[coolio].rookies *= 2);
       
      

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