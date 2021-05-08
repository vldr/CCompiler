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

        void test(const int fff)
        {
            int uj = fff;
        }
        
        
        `);
    }
}

Main.start();