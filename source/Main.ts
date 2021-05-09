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
        
        int sqrt(int x) 
        {
            int s = 0, b = 32768; 
            while (b)  
            { 
                int t = (s + b); 
                if (t * t <= x) s = t; 
                b >>= 1;
            }
            return s; 
        } 

        /* Fast power. */
        int pow(int base, int exp)
        {
            int result = 1;
            while (exp)
            {
                if ((exp & 1) == 1) result *= base;
                exp >>= 1;
                base *= base;
            }
            return result;
        }
        
        int result = pow(sqrt(0x1b346c90), 2);`));
    }
}

Main.start();