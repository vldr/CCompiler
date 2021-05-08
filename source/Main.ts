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
        
        int coolio[2];
        SuperCookie a;
        SuperCookie b;

        int test(const int fff)
        {
            int uj = fff;
            return a.superness[0].rookies;
        }
        
        
        `);
    }
}

Main.start();