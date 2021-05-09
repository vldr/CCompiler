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
        
        
        SuperCookie a[2];
        
        float tesjkt(float fff)
        {
            return fff;
        }
        
        
        float test(int index, float fff, float aaa)
        {
            fff = fff * 2.f * tesjkt(aaa);
            a[index].superness[index].cookieness = fff;
            return fff;
        }
        
        float lolol = 12.f;
        float alpha = test(0, lolol / 2.f, 4.f);
        
        `));
    }
}

Main.start();