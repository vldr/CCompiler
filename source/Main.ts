import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        new Compiler().compile(`
        int b = 12;
        uint ayy = 12;
        const float r = 9.458469f;
        int a[2];
        int c[] = { 3, 4 };
        `);
    }
}

Main.start();