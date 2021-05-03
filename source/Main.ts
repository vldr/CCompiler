import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        struct Munchies {
            float cookieness;
        };
        
        struct Hello {
            int data;
            Munchies cookie;
        };
        
        Hello node;
        float f = 328.748;
        int a = 222;
        int ii = a;
        
        
        
        // uint d = 4096;
        // float ayy = 17.38947;
        //
        // const float r = 9.458469f;
        //
        // int a[2];
        //
        // int c[] = { 3, 4 };
        
        `);
    }
}

Main.start();