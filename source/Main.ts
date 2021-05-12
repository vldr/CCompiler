import Logger from "./Logger"
import Compiler from "./Compiler";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        console.log(compiler.compile(`
        uint key[] = { 0x2399ab3du, 0x19283939u, 0x7828a829u, 0x19283938u };
uint v[] = { 0x68u, 0x69u };

void xtea(uint numRounds, uint mode) 
{
    uint v0 = v[0]; 
    uint v1 = v[1];
    uint sum = 0u;

    uint delta = 0x9E3779B9u;

    if (!mode)
        sum = delta * numRounds;

    for (uint i = 0u; i < numRounds; i++) 
    {
        if (mode)
        {
            v0 += (((v1 << 4u) ^ (v1 >> 5u)) + v1) ^ (sum + key[sum & 3u]);
            sum += delta;
            v1 += (((v0 << 4u) ^ (v0 >> 5u)) + v0) ^ (sum + key[(sum >> 11u) & 3u]);
        }
        else
        {
            v1 -= (((v0 << 4u) ^ (v0 >> 5u)) + v0) ^ (sum + key[(sum >> 11u) & 3u]);
            sum -= delta;
            v0 -= (((v1 << 4u) ^ (v1 >> 5u)) + v1) ^ (sum + key[sum & 3u]);
        }
    }

    v[0] = v0; 
    v[1] = v1;
}

xtea(32u, 1u);
xtea(32u, 0u);
        `));
    }
}

Main.start();