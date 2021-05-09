import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        console.log(new Compiler().compile(`
        struct Munchies
        {
            float cookieness[3];
            int rookies;
        };

        Munchies m;

        float main()
        {
            const float a[] = { m.cookieness[0], 2.f };
            return a[0];
        }

        float result = main();
        `));
    }
}

Main.start();