import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        console.log(new Compiler().compile(`
        struct Munchies {
            float cookieness;
            float rookies;
        };

        struct SuperCookie {
            Munchies superness[2];
            Munchies cookie;
        };
        
        int test(int index)
        {
            if (index > 0)
            {
                int index = 9;
                index = 8;
            }
            
            if (index < 0)
            {
                const int index = 9;
            }
            
            return index;
        }
        
        int result = test(1);
        
        `));
    }
}

Main.start();