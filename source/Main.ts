import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start()
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
        // Credits to http://www.rosettacode.org/wiki/Tonelli-Shanks_algorithm#C

uint modpow(uint a, uint b, uint n) 
{
    uint x = 1u, y = a;

    while (b > 0u) 
    {
        if (b % 2u == 1u) {
            x = (x * y) % n; // multiplying with base
        }
        y = (y * y) % n; // squaring the base
        b /= 2u;
    }

    return x % n;
}
 
struct Solution 
{
    uint root1, root2;
    uint exists;
};

Solution sol;
 
void makeSolution(uint root1, uint root2, uint exists) 
{
    sol.root1 = root1;
    sol.root2 = root2;
    sol.exists = exists;
}
 
void ts(uint n, uint p) 
{
    uint q = p - 1u;
    uint ss = 0u;
    uint z = 2u;
    uint c, r, t, m;
 
    if (modpow(n, (p - 1u) / 2u, p) != 1u) {
        return makeSolution(0u, 0u, 0u);
    }
 
    while ((q & 1u) == 0u) {
        ss += 1u;
        q >>= 1u;
    }
 
    if (ss == 1u) {
        uint r1 = modpow(n, (p + 1u) / 4u, p);
        return makeSolution(r1, p - r1, 1u);
    }
 
    while (modpow(z, (p - 1u) / 2u, p) != p - 1u) {
        z++;
    }
 
    c = modpow(z, q, p);
    r = modpow(n, (q + 1u) / 2u, p);
    t = modpow(n, q, p);
    m = ss;
 
    while (1) {
        uint i = 0u, zz = t;
        uint b = c, e;
        if (t == 1u) {
            return makeSolution(r, p - r, 1u);
        }
        while (zz != 1u && i < (m - 1u)) {
            zz = zz * zz % p;
            i++;
        }
        e = m - i - 1u;
        while (e > 0u) {
            b = b * b % p;
            e--;
        }
        r = r * b % p;
        c = b * b % p;
        t = t * c % p;
        m = i;
    }
}

ts(1030u, 10009u);
        `);

        const interpreter = new Interpreter(result);
        //await interpreter.run();
        console.log(result);
    }
}

Main.start();