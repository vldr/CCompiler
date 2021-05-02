import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        const struct {
            int data;
        };
        //
        // Node node;
        
        const float f = 328748;
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