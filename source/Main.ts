import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
            uint z1 = 687u, z2 = 10340u, z3 = 2828u, z4 = 30705u;

uint rand()
{
    uint b  = ((z1 << 6u) ^ z1) >> 13u;
    z1 = ((z1 & 4294967294u) << 18u) ^ b;
    b  = ((z2 << 2u) ^ z2) >> 27u; 
    z2 = ((z2 & 4294967288u) << 2u) ^ b;
    b  = ((z3 << 13u) ^ z3) >> 21u;
    z3 = ((z3 & 4294967280u) << 7u) ^ b;
    b  = ((z4 << 3u) ^ z4) >> 12u;
    z4 = ((z4 & 4294967168u) << 13u) ^ b;

    return (z1 ^ z2 ^ z3 ^ z4);
}

float sqrt(float number)
{
	uint i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = (uint)y;     
	i  = 0x5f3759dfu - ( i >> 1u );
	y  = (float)i;
	y  = y * ( threehalfs - ( x2 * y * y ) );

	return 1.0 / y;
}

float estimatePi(int numThrows)
{
    int inCircle = 0;
    
    for (int i = 0; i < numThrows; i++) 
    {
        const float MAX_RAND = (float)0x4f800000u;

        float x = (float)(int)rand() / MAX_RAND;
		float y = (float)(int)rand() / MAX_RAND;

        float dist = sqrt(x * x + y * y);
 
        if (dist < 0.5) 
            inCircle++;
    }

    return 4.0 * ((float)inCircle / (float)numThrows);
}

float answer = estimatePi(10000);
        `);

        const interpreter = new Interpreter(result);
        interpreter.run();

        console.log(result);

        // @ts-ignore
        console.log(interpreter.memoryRegions.get("var_answer"));
    }
}

Main.start();