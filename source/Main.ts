import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        console.log(new Compiler().compile(`
        struct Munchies {
            float cookieness;
            int rookies;
        };

        struct SuperCookie {
            Munchies superness[2];
            Munchies cookie;
        };
        
        
        float tesjkt(float fff)
        {
            return fff;
        }
        
        
        float test(float fff, float aaa)
        {
            fff = fff * 2.f * tesjkt(aaa);
            return fff;
        }
        
        float lolol = 12.f;
        float a = test(lolol / 2.f, 4.f);
        
        `));
    }
}

Main.start();