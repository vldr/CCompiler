import Interpreter from "../source/Interpreter";
import Compiler from "../source/Compiler";

test("Test 'fib.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(
        `/* Iterative fibonacci */
        int fibonacci(int n)
        {
            int previousPreviousNumber, previousNumber = 0, currentNumber = 1;
        
            for (int i = 1; i < n; i++) 
            {
                previousPreviousNumber = previousNumber;
                previousNumber = currentNumber;
                currentNumber = previousPreviousNumber + previousNumber;
            }
        
            return currentNumber;
        }
        
        // The memory region 'var_result' should contain 2584 afterwards.
        int result = fibonacci(18);`
    );

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get("var_result")).toStrictEqual(new Int32Array([ 2584 ]));
});

test("Test 'sqrt.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
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
        
        int result = pow(
            sqrt(0x1b346c90),
            2
        );
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get("var_result")).toStrictEqual(new Int32Array([ 0x1b346c90 ]));
});

test("Test 'quick_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int array[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        
        int partition(int l, int h) 
        { 
            int x = array[h]; 
            int i = (l - 1); 
          
            for (int j = l; j <= h - 1; j++) 
            { 
                if (array[j] <= x) 
                { 
                    i++; 
                    swap(i, j); 
                } 
            } 
            swap(i + 1, h); 
        
            return (i + 1); 
        } 
        
        void qsort(int l, int h) 
        { 
            _push(l);
            _push(h);
        
            int top = 2;
          
            while (top > 0) 
            { 
                h = _pop_int();
                l = _pop_int();
        
                top -= 2;
         
                int p = partition(l, h); 
        
                if (p > 0 && p - 1 > l) 
                { 
                    _push(l);
                    _push(p - 1);
        
                    top += 2;
                } 
          
                if (p + 1 < h) 
                { 
                    _push(p + 1);
                    _push(h);
        
                    top += 2;
                }  
            }
        }
        
        qsort(0, array.length - 1);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_array_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'selection_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int array[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        
        int findMin(int start, int end)
        {
            int indexSmallest = start;
            
            for (int i = start; i < end; i++)
            {
                if (array[i] < array[indexSmallest])
                {
                    indexSmallest = i;
                }
            }
            return indexSmallest;
        }
        
        void selectionSort(int start, int end)
        {
            for (int i = start; i < end - 1; i++)
            {
                int indexSmallest = findMin(i + 1, end);
                
                if (array[indexSmallest] < array[i])
                {
                    swap(i, indexSmallest);
                }
            }
        }
        
        selectionSort(0, array.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_array_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'cosine.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        /* Credits to http://web.eecs.utk.edu/~azh/blog/cosine.html */
        const float CONST_PI = 3.1415927410125732;
        const int ITERATIONS = 100;
        
        float cosine(float x)
        {
            int div = (int)(x / CONST_PI);
            x = x - ((float)div * CONST_PI);
            float sign = 1.0;
        
            if (div % 2 != 0)
                sign = -1.0;
        
            float result = 1.0;
            float inter = 1.0;
            float num = x * x;
        
            for (int i = 1; i <= ITERATIONS; i++)
            {
                float comp = 2.0 * (float)i;
                float den = comp * (comp - 1.0);
        
                inter *= num / den;
        
                if (i % 2 == 0)
                    result += inter;
                else
                    result -= inter;
            }
        
            return sign * result;
        }
        
        float angles[] = { 
            0.0, 
            6.71238898038469,
            0.7853981633974483, 
            1.0471975511965976,
            1.5707963267948966
        };
        
        /*
        * Expected values:
        *
        * var_angles_0 (1.000000)
        * var_angles_1 (0.909295)
        * var_angles_2 (0.707107)
        * var_angles_3 (0.500000)
        * var_angles_4 (-0.000000)
        */
        void calculateAngles()
        {
            for (int i = 0; i < angles.length; i++)
                angles[i] = cosine(angles[i]);
        }
        
        calculateAngles();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_angles_0`)).toStrictEqual(new Float32Array([ 1.000000 ]));
    expect(interpreter.memoryRegions.get(`var_angles_1`)).toStrictEqual(new Float32Array([ 0.9092974662780762 ]));
    expect(interpreter.memoryRegions.get(`var_angles_2`)).toStrictEqual(new Float32Array([ 0.7071067690849304 ]));
    expect(interpreter.memoryRegions.get(`var_angles_3`)).toStrictEqual(new Float32Array([ 0.49999991059303284 ]));
    expect(interpreter.memoryRegions.get(`var_angles_4`)).toStrictEqual(new Float32Array([ -6.247336870046638e-8 ]));
});

test("Test 'mod_pow.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint modPow(uint b, uint e, uint m)
        {
            if (m == 1u)
                return 0u;
            else 
            {
                uint r = 1u;
                b %= m;
        
                while (e > 0u) 
                {
                    if (e % 2u == 1u) 
                        r = (r * b) % m;
        
                    e >>= 1u;  
                    b = (b * b) % m;
                }
        
                return r;
            }
        }
        
        uint result = modPow(779u, 3u, 15u);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 0xe ]));
});

test("Test 'sqrtf.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        float sqrtf(float n) 
        { 
            float x = n; 
            float y = 1.0; 
            float e = 0.000001;
        
            while (x - y > e) 
            { 
                x = (x + y) / 2.0;
                y = n / x;
            } 
        
            return x; 
        } 
        
        float answer = sqrtf(64.0);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_answer`)).toStrictEqual(new Float32Array([ 8 ]));
});

test("Test 'minimum_sum_partition.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct Table 
        {
            int a[27];
        };
        
        int s[] = { 9, 5, 2, 3, 7 };
        
        int minPartition()
        { 
            Table T[6]; 
            const int sum = T[0].a.length - 1;
            
            for (int i = 0; i <= s.length; i++)
            {
                T[i].a[0] = 1;
            
                for (int j = 1; i > 0 && j <= sum; j++)
                {
                    T[i].a[j] = T[i - 1].a[j];
            
                    if (s[i - 1] <= j) {
                        T[i].a[j] |= T[i - 1].a[j - s[i - 1]];
                    }
                }
            }
            
            int j = sum / 2;
            while (j >= 0 && !T[s.length].a[j]) {
                j--;
            }
        
            return sum - 2*j;
        }
        
        int result = minPartition();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 2 ]));
});

test("Test 'pots_of_gold.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int coin[] = { 9, 6, 2, 3 };

        struct Table 
        {
            int a[coin.length];
        };
        
        Table T[coin.length];
        
        int max(int a, int b)
        {
            return a > b ? a : b;
        }
        
        int min(int a, int b)
        {
            return a < b ? a : b;
        }
        
        int calculate(int i, int j)
        {
            if (i <= j) {
                return T[i].a[j];
            }
         
            return 0;
        }
         
        int findMaxCoins(int n)
        {
            if (n == 1) 
            {
                return coin[0];
            }
        
            if (n == 2) 
            {
                return max(coin[0], coin[1]);
            }
        
            for (int iteration = 0; iteration < n; iteration++)
            {
                int i = 0, j = iteration;
        
                while (j < n)
                {
                    int start = coin[i] + min(calculate(i + 2, j), calculate(i + 1, j - 1));
                    int end = coin[j] + min(calculate(i + 1, j - 1), calculate(i, j - 2));
         
                    T[i].a[j] = max(start, end);
        
                    i++;
                    j++;
                }
            }
         
            return T[0].a[n - 1];
        }
        
        int result = findMaxCoins(coin.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 12 ]));
});

test("Test 'crc32.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint data[] = { 0x69u, 0x68u };

        uint generateCrc32()
        {
            uint crc, msb;
            crc = 0xFFFFFFFFu;
        
            for (int i = 0; i < data.length; i++) 
            {
                crc ^= (data[i] << 24u);
        
                for (int j = 0; j < 8; j++) 
                { 
                    uint msb = crc >> 31u;
                    crc <<= 1u;
                    crc ^= (0u - msb) & 0x04C11DB7u;
                }
            }
            
            return crc; 
        }
        
        // variable_0_crc32 = 0xb3ae97b6
        uint crc32 = generateCrc32();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_crc32`)).toStrictEqual(new Uint32Array([ 0xb3ae97b6 ]));
});

test("Test 'pascal.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int binomialCoeff(int n, int k) 
        { 
            int res = 1; 
        
            if (k > n - k) 
                k = n - k; 
        
            for (int i = 0; i < k; ++i) 
            { 
                res *= (n - i); 
                res /= (i + 1); 
            } 
              
            return res; 
        } 
        
        void run()
        {
            int triangle[16];
        
            // 1 15 105 455 1365 3003 5005 6435 6435 5005 3003 1365 455 105 15 1
            for (int i = 0; i < triangle.length; i++) 
            {
                triangle[i] = binomialCoeff(triangle.length - 1, i);
            }
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const binomialCoeff = (n: number, k: number): number =>
    {
        let res = 1;

        if (k > n - k)
            k = n - k;

        for (let i = 0; i < k; ++i)
        {
            res *= (n - i);
            res /= (i + 1);
        }

        return res;
    };

    for (let i = 0; i < 16; i++)
    {
        // @ts-ignore
        expect(new Uint32Array(interpreter.memoryRegions.get(`run_var_triangle_${i}`))).toStrictEqual(new Uint32Array([ binomialCoeff(15, i) ]))
    }


});

test("Test 'xtea.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
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
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_v_0`)).toStrictEqual(new Uint32Array([ 104 ]));
    expect(interpreter.memoryRegions.get(`var_v_1`)).toStrictEqual(new Uint32Array([ 105 ]));
});

test("Test 'bcd.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int month = 5;
        int day = 12;
        int year = 2021;
        
        int bcd = 0;
        
        void placeNumber(int number, int digits)
        {
            for (int i = digits; i > 0; i--)
            {
                _push(number % 10);
        
                number /= 10;
            }
        
            for (int i = 0; i < digits; i++)
            {
                bcd <<= 4;
                bcd |= _pop_int();
            }
        }
        
        /* 
        * Expected result
        * variable_0_bcd 0x05122021 
        */
        placeNumber(month, 2);
        placeNumber(day, 2);
        placeNumber(year, 4);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_bcd`)).toStrictEqual(new Uint32Array([ 0x05122021 ]));
});

test("Test 'tonelli_shanks.c'.", async () => {
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
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_sol__root1`)).toStrictEqual(new Uint32Array([ 1632 ]));
    expect(interpreter.memoryRegions.get(`var_sol__root2`)).toStrictEqual(new Uint32Array([ 8377 ]));
});

test("Test 'russian_peasant.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct Result {
            uint a;
            uint b;
        };
        
        uint russianPeasant(uint a, uint b) 
        { 
            uint res = 0u;
          
            while (b > 0u) 
            { 
                if (b & 1u) 
                    res = res + a; 
        
                a = a << 1u; 
                b = b >> 1u; 
            } 
        
            return res; 
        } 
        
        void run()
        {
            Result result;
        
            // a = 18
            // b = 240
            result.a = russianPeasant(18u, 1u);
            result.b = russianPeasant(20u, 12u);
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`run_var_result__a`)).toStrictEqual(new Uint32Array([ 18 ]));
    expect(interpreter.memoryRegions.get(`run_var_result__b`)).toStrictEqual(new Uint32Array([ 240 ]));
});

test("Test 'approxE.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        float exponential(int n, float x)  
        {  
            float sum = 1.0;  
          
            for (int i = n - 1; i > 0; --i)  
                sum = (x * sum / (float)i) + 1.0;  
          
            return sum;  
        }  
        
        int n = 10;  
        float x = 1.0; 
        
        // 2.718282f
        _load_a(
            exponential(n, x)
        );
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Float32Array([ 2.7182815074920654 ]));
});

test("Test 'is_multiple_of_3.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint is_multiple_of_3(int n) 
        { 
            int odd_count = 0; 
            int even_count = 0; 
          
            if (n < 0) 
                n = -n; 
        
            if (n == 0) 
                return 1u; 
        
            if (n == 1) 
                return 0u; 
          
            while (n) 
            { 
                if (n & 1) 
                    odd_count = odd_count + 1; 
        
                if (n & 2) 
                    even_count = even_count + 1; 
        
                n >>= 2; 
            } 
            
            int a = odd_count - even_count;
        
            if (a < 0)
            {
                a = -a;
            }
        
            return is_multiple_of_3(a); 
        } 
        
        _load_a(is_multiple_of_3(5463));
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 1 ]));
});

test("Test 'tuxedo_rental_problem.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        // Tuxedo Rental Problem
        struct RentalRequest 
        {
            int start;
            int finish;
        };
        
        int result[4];
        RentalRequest A[result.length];
        
        int max(int a, int b) { return a > b ? a : b; }
        
        void iterative() 
        {
            for (int i = 0; i < A.length; i++) 
            {
                if (i == 0)
                    result[i] = A[i].finish - A[i].start;
                else if (i > 0) 
                {
                    int j = i - 1;
        
                    while (j >= 0 && A[j].finish >= A[i].start)
                        j--;
        
                    if (j >= 0)
                        result[i] = max(result[i - 1], A[i].finish - A[i].start + result[j]);
                    else
                        result[i] = max(result[i - 1], A[i].finish - A[i].start);
                }
            }
        }
        
        void run() 
        {
            A[0].start = 0;
            A[0].finish = 5;
        
            A[1].start = 15;
            A[1].finish = 25;
        
            A[2].start = 6;
            A[2].finish = 8;
        
            A[3].start = 10;
            A[3].finish = 11;
        
            iterative();
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get("var_result_0")).toStrictEqual(new Int32Array([ 5 ]));
    expect(interpreter.memoryRegions.get("var_result_1")).toStrictEqual(new Int32Array([ 15 ]));
    expect(interpreter.memoryRegions.get("var_result_2")).toStrictEqual(new Int32Array([ 15 ]));
    expect(interpreter.memoryRegions.get("var_result_3")).toStrictEqual(new Int32Array([ 16 ]));
});

test("Test 'catalan_numbers.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint numbers[15];

        uint binomialCoeff(uint n, uint k)
        {
            uint res = 1u;
        
            if (k > n - k)
                k = n - k;
         
            for (uint i = 0u; i < k; ++i) {
                res *= (n - i);
                res /= (i + 1u);
            }
         
            return res;
        }
        
        uint catalan(uint n)
        {
            uint c = binomialCoeff(2u * n, n);
        
            return c / (n + 1u);
        }
        
        void run()
        {
            for (uint i = 0u; i < (uint)numbers.length; i++)
                numbers[i] = catalan(i);
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const catalan = (n: number) =>
    {
        if (n <= 1)
            return 1;

        let res = 0;
        for(let i = 0; i < n; i++)
            res += catalan(i) *
                catalan(n - i - 1);

        return res;
    }

    for (let i = 0; i < 15; i++)
        expect(interpreter.memoryRegions.get(`var_numbers_${i}`)).toStrictEqual(new Uint32Array([ catalan(i) ]));
});

test("Test 'square_free.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int squareFree(int n)
        {
            int cnt = 0;
        
            for (int i = 1;; i++)
            {
                uint isSqFree = 1u;
        
                for (int j=2; j*j<=i; j++)
                {
                    if (i % (j*j) == 0)
                    {
                        isSqFree = 0u;
                        break;
                    }
                }
        
                if (isSqFree == 1u)
                {
                    cnt++;
            
                    if (cnt == n)
                        return i;
                }
            }
        
            return 0;
        }
        
        int result = squareFree(5);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 6 ]));
});

test("Test 'subset_sum.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct Subset {
            int a[10];
        };
        
        int set[] = { 3, 34, 4, 12, 5, 2 };
        int sum = 9;
        int n = set.length;
        
        int isSubsetSum()
        {
            Subset subset[7];
        
            for (int i = 0; i <= n; i++)
                subset[i].a[0] = 1;
         
            for (int i = 1; i <= sum; i++)
                subset[0].a[i] = 0;
        
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= sum; j++) {
                    if (j < set[i - 1])
                        subset[i].a[j] = subset[i - 1].a[j];
                    if (j >= set[i - 1])
                        subset[i].a[j] = subset[i - 1].a[j] || subset[i - 1].a[j - set[i - 1]];
                }
            }
        
            return subset[n].a[sum];
        }
        
        int result = isSubsetSum();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 1 ]));
});

test("Test 'bell_numbers.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct Bell {
            int a[10];
        };
        
        Bell bell[10];
        int results[bell.length];
        
        int bellNumber(int n)
        {
            bell[0].a[0] = 1;
        
            for (int i = 1; i<=n; i++)
            {
                bell[i].a[0] = bell[i-1].a[i-1];
        
                for (int j = 1; j <= i; j++)
                    bell[i].a[j] = bell[i-1].a[j-1] + bell[i].a[j-1];
            }
        
            return bell[n].a[0];
        }
        
        void run()
        {
            for (int i = 0; i < results.length; i++)
            {
                results[i] = bellNumber(i);
            }
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_results_0`)).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_results_1`)).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_results_2`)).toStrictEqual(new Int32Array([ 2 ]));
    expect(interpreter.memoryRegions.get(`var_results_3`)).toStrictEqual(new Int32Array([ 5 ]));
    expect(interpreter.memoryRegions.get(`var_results_4`)).toStrictEqual(new Int32Array([ 15 ]));
    expect(interpreter.memoryRegions.get(`var_results_5`)).toStrictEqual(new Int32Array([ 52 ]));
    expect(interpreter.memoryRegions.get(`var_results_6`)).toStrictEqual(new Int32Array([ 203 ]));
    expect(interpreter.memoryRegions.get(`var_results_7`)).toStrictEqual(new Int32Array([ 877 ]));
    expect(interpreter.memoryRegions.get(`var_results_8`)).toStrictEqual(new Int32Array([ 4140 ]));
});

test("Test 'moser_de_bruijn.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int S[16];
        int n = S.length - 1;
        
        int gen()
        {
            S[0] = 0;
            S[1] = 1;
         
            for (int i = 2; i <= n; i++)
            {   
                if (i % 2 == 0)
                   S[i] = 4 * S[i / 2];
                else
                   S[i] = 4 * S[i / 2] + 1;
            }
             
            return S[n];
        }
        
        gen();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_S_0`)).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.memoryRegions.get(`var_S_1`)).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_S_2`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_S_3`)).toStrictEqual(new Int32Array([ 5 ]));
    expect(interpreter.memoryRegions.get(`var_S_4`)).toStrictEqual(new Int32Array([ 16 ]));
    expect(interpreter.memoryRegions.get(`var_S_5`)).toStrictEqual(new Int32Array([ 17 ]));
    expect(interpreter.memoryRegions.get(`var_S_6`)).toStrictEqual(new Int32Array([ 20 ]));
    expect(interpreter.memoryRegions.get(`var_S_7`)).toStrictEqual(new Int32Array([ 21 ]));
    expect(interpreter.memoryRegions.get(`var_S_8`)).toStrictEqual(new Int32Array([ 64 ]));
    expect(interpreter.memoryRegions.get(`var_S_9`)).toStrictEqual(new Int32Array([ 65 ]));
    expect(interpreter.memoryRegions.get(`var_S_10`)).toStrictEqual(new Int32Array([ 68 ]));
    expect(interpreter.memoryRegions.get(`var_S_11`)).toStrictEqual(new Int32Array([ 69 ]));
    expect(interpreter.memoryRegions.get(`var_S_12`)).toStrictEqual(new Int32Array([ 80 ]));
    expect(interpreter.memoryRegions.get(`var_S_13`)).toStrictEqual(new Int32Array([ 81 ]));
    expect(interpreter.memoryRegions.get(`var_S_14`)).toStrictEqual(new Int32Array([ 84 ]));
    expect(interpreter.memoryRegions.get(`var_S_15`)).toStrictEqual(new Int32Array([ 85 ]));
});

test("Test 'count_jump.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {1, 3, 5, 8, 9, 1, 0, 7, 6, 8, 9};
        int count_jump[arr.length];
        
        void countWaysToJump(int n)
        {
            for (int i = 0; i < n; i++)
                count_jump[i] = 0;
        
            for (int i = n - 2; i >= 0; i--)
            {
                if (arr[i] >= n - i - 1)
                    count_jump[i]++;
         
                for (int j = i + 1; j < n - 1 && j <= arr[i] + i; j++)
                    if (count_jump[j] != -1)
                        count_jump[i] += count_jump[j];
         
                if (count_jump[i] == 0)
                    count_jump[i] = -1;
            }
        }
         
        countWaysToJump(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_count_jump_0`)).toStrictEqual(new Int32Array([ 52 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_1`)).toStrictEqual(new Int32Array([ 52 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_2`)).toStrictEqual(new Int32Array([ 28 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_3`)).toStrictEqual(new Int32Array([ 16 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_4`)).toStrictEqual(new Int32Array([ 8 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_5`)).toStrictEqual(new Int32Array([ -1 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_6`)).toStrictEqual(new Int32Array([ -1 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_7`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_8`)).toStrictEqual(new Int32Array([ 2 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_9`)).toStrictEqual(new Int32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_count_jump_10`)).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test 'golomb.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int dp[10];

        void golomb(int n)
        {
            dp[1] = 1;
        
            for (int i = 2; i <= n; i++)
                dp[i] = 1 + dp[i - dp[dp[i - 1]]];
        }
        
        golomb(dp.length - 1);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_dp_0`)).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.memoryRegions.get(`var_dp_1`)).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_dp_2`)).toStrictEqual(new Int32Array([ 2 ]));
    expect(interpreter.memoryRegions.get(`var_dp_3`)).toStrictEqual(new Int32Array([ 2 ]));
    expect(interpreter.memoryRegions.get(`var_dp_4`)).toStrictEqual(new Int32Array([ 3 ]));
    expect(interpreter.memoryRegions.get(`var_dp_5`)).toStrictEqual(new Int32Array([ 3 ]));
    expect(interpreter.memoryRegions.get(`var_dp_6`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_dp_7`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_dp_8`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_dp_9`)).toStrictEqual(new Int32Array([ 5 ]));
});

test("Test 'matrix_determinant.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct SubMatrix {
            int pad1;
            int pad2[2];
            int b[3];
            float pad3;
        };
        
        struct Matrix {
            int pad1;
            int pad2[2];
            SubMatrix a[3];
            float pad3;
        };
        
        Matrix m[3];
        
        const int PAD1_VALUE = 123456789;
        const int PAD2_VALUE = 789456123;
        const float PAD3_VALUE = 123456789.f;
        
        int determinant(int index) 
        {
            return m[index].a[0].b[0] * ((m[index].a[1].b[1] * m[index].a[2].b[2]) - (m[index].a[2].b[1]*m[index].a[1].b[2])) -m[index].a[0].b[1] * (m[index].a[1].b[0]
           * m[index].a[2].b[2] - m[index].a[2].b[0] * m[index].a[1].b[2]) + m[index].a[0].b[2] * (m[index].a[1].b[0] * m[index].a[2].b[1] - m[index].a[2].b[0] * m[index].a[1].b[1]);
        }
        
        int run(int index)
        {
            m[index].pad1 = PAD1_VALUE;
            
            for (int i = 0; i < m[index].pad2.length; i++)
                 m[index].pad2[i] = PAD2_VALUE;
            
            m[index].pad3 = PAD3_VALUE;
            
            for (int i = 0; i < m[index].a.length; i++)
            {
                 m[index].a[i].pad1 = PAD1_VALUE;
            
                for (int j = 0; j < m[index].pad2.length; j++)
                     m[index].a[i].pad2[j] = PAD2_VALUE;
                
                m[index].a[i].pad3 = PAD3_VALUE;
            }   

            if (index == 0)
            {
                m[index].a[0].b[0] = 6;
                m[index].a[0].b[1] = 1;
                m[index].a[0].b[2] = 1;
            
                m[index].a[1].b[0] = 4;
                m[index].a[1].b[1] = -2;
                m[index].a[1].b[2] = 5;
            
                m[index].a[2].b[0] = 2;
                m[index].a[2].b[1] = 8;
                m[index].a[2].b[2] = 7;
            }
            else if (index == 1)
            {
                m[index].a[0].b[0] = 1;
                m[index].a[0].b[1] = 2;
                m[index].a[0].b[2] = 3;
            
                m[index].a[1].b[0] = 0;
                m[index].a[1].b[1] = -4;
                m[index].a[1].b[2] = 1;
            
                m[index].a[2].b[0] = 0;
                m[index].a[2].b[1] = 3;
                m[index].a[2].b[2] = -1;
            }
            else
            {
                m[index].a[0].b[0] = 5;
                m[index].a[0].b[1] = -2;
                m[index].a[0].b[2] = 1;
            
                m[index].a[1].b[0] = 0;
                m[index].a[1].b[1] = 3;
                m[index].a[1].b[2] = -1;
            
                m[index].a[2].b[0] = 2;
                m[index].a[2].b[1] = 0;
                m[index].a[2].b[2] = 7;
            }
            
            /////////////////////////////////////////////////
            
            if (m[index].pad1 != PAD1_VALUE)
                return 0;
            
            for (int i = 0; i < m[index].pad2.length; i++)
                if (m[index].pad2[i] != PAD2_VALUE)
                    return 0;

            if (m[index].pad3 != PAD3_VALUE)
                return 0;
            
            for (int i = 0; i < m[index].a.length; i++)
            {
                if (m[index].a[i].pad1 != PAD1_VALUE)
                    return 0;
            
                for (int j = 0; j < m[index].pad2.length; j++)
                    if (m[index].a[i].pad2[j] != PAD2_VALUE)
                        return 0;
                        
                if (m[index].a[i].pad3 != PAD3_VALUE)
                    return 0;
            }   
                
            return determinant(index);
        }
        
        int result_0 = run(0);
        int result_1 = run(1);
        int result_2 = run(2);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result_0`)).toStrictEqual(new Int32Array([ -306 ]));
    expect(interpreter.memoryRegions.get(`var_result_1`)).toStrictEqual(new Int32Array([ 1 ]));
    expect(interpreter.memoryRegions.get(`var_result_2`)).toStrictEqual(new Int32Array([ 103 ]));
});

test("Test 'nth_root.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        const float DBL_EPSILON = 2.2204460492503131e-016;

        float powf(float x, int e)
        {
            int i;
            float r = 1.f;
        
            for (i = 0; i < e; i++)
            {
                r *= x;
            }
        
            return r;
        }
         
        float root(int n, float x) 
        {
            float d, r = 1.f;
        
            if (x == 0.f) 
            {
                return 0.f;
            }
        
            if (n < 1 || (x < 0.0 && !(n & 1))) 
            {
                return 0.0 / 0.0; /* NaN */
            }
        
            do 
            {
                d = (x / powf(r, n - 1) - r) / (float)n;
                r += d;
            } 
            while (d >= DBL_EPSILON * 10.0 || d <= -DBL_EPSILON * 10.0);
        
            return r;
        }
        
        int n = 15;
        float answer = root(n, powf(-3.14159, n));
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_answer`)).toStrictEqual(new Float32Array([ -3.14159 ]));
});

test("Test 'integer_roots.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint pow(uint base, uint exp)
        {
            uint result = 1u;
        
            while (exp)
            {
                if ((exp & 1u) == 1u) result *= base;
                exp >>= 1u;
                base *= base;
            }
            
            return result;
        }
        
        uint root(uint base, uint n) 
        {
            uint n1, n2, n3, c, d, e;
         
            if (base < 2u) return base;
            if (n == 0u) return 1u;
         
            n1 = n - 1u;
            n2 = n;
            n3 = n1;
            c = 1u;
            d = (n3 + base) / n2;
            e = (n3 * d + base / (uint)pow(d, n1)) / n2;
         
            while (c != d && c != e) {
                c = d;
                d = e;
                e = (n3*e + base / (uint)pow(e, n1)) / n2;
            }
         
            if (d < e) return d;
            return e;
        }
        
        uint result = root(9u, 3u);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 2 ]));
});

test("Test 'jenkins_hash.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        // "The quick brown fox jumps over the lazy dog"
        uint key[] = { 
            0x54u, 0x68u, 0x65u, 0x20u, 0x71u, 0x75u, 0x69u, 
            0x63u, 0x6bu, 0x20u, 0x62u, 0x72u, 0x6fu, 0x77u, 
            0x6eu, 0x20u, 0x66u, 0x6fu, 0x78u, 0x20u, 0x6au, 
            0x75u, 0x6du, 0x70u, 0x73u, 0x20u, 0x6fu, 0x76u,
            0x65u, 0x72u, 0x20u, 0x74u, 0x68u, 0x65u, 0x20u, 
            0x6cu, 0x61u, 0x7au, 0x79u, 0x20u, 0x64u, 0x6fu,
            0x67u 
        };
        
        uint jenkins_one_at_a_time_hash() 
        {
            int i = 0;
            uint hash = 0u;
        
            while (i != key.length) {
                hash += key[i++];
                hash += hash << 10u;
                hash ^= hash >> 6u;
            }
        
            hash += hash << 3u;
            hash ^= hash >> 11u;
            hash += hash << 15u;
        
            return hash;
        }
        
        uint result = jenkins_one_at_a_time_hash();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 0x519e91f5 ]));
});

test("Test 'binary_search.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            1, 4, 5, 7, 7, 9, 9, 
            11, 13, 14, 15, 15, 17,
            18, 19, 20, 25, 25, 26, 
            30, 30, 32, 33, 34, 35, 
            36, 40, 42, 44, 47, 48, 
            49, 52, 55, 56, 58
        };
        
        int binarySearch(int x)
        {
            int l = 0, r = arr.length - 1;
        
            while (l <= r) {
                int m = l + (r - l) / 2;
        
                if (arr[m] == x)
                    return m;
        
                if (arr[m] < x)
                    l = m + 1;
                else
                    r = m - 1;
            }
            
            return -1;
        }
        
        int result = binarySearch(34);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 23 ]));
});

test("Test 'PJW_hash.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        // "The quick brown fox jumps over the lazy dog"
        uint key[] = { 
            0x54u, 0x68u, 0x65u, 0x20u, 0x71u, 0x75u, 0x69u, 
            0x63u, 0x6bu, 0x20u, 0x62u, 0x72u, 0x6fu, 0x77u, 
            0x6eu, 0x20u, 0x66u, 0x6fu, 0x78u, 0x20u, 0x6au, 
            0x75u, 0x6du, 0x70u, 0x73u, 0x20u, 0x6fu, 0x76u,
            0x65u, 0x72u, 0x20u, 0x74u, 0x68u, 0x65u, 0x20u, 
            0x6cu, 0x61u, 0x7au, 0x79u, 0x20u, 0x64u, 0x6fu,
            0x67u, 0x00u
        };
        
        uint PJWHash()
        {
            uint h = 0u, high;
            uint s = 0u;
        
            while (key[s])
            {
                h = (h << 4u) + key[s++];
        
                if (high = h & 0xF0000000u)
                    h ^= high >> 24u;
        
                h &= ~high;
            }
        
            return h;
        }
        
        uint result = PJWHash();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 69733463 ]));
});

test("Test 'count_ones.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = { 1, 1, 1, 1, 0, 0, 0 };
        
        int countOnes(int low, int high)
        {
            if (high >= low)
            {
                int mid = low + (high - low)/2;
        
                if ( (mid == high || arr[mid+1] == 0) && (arr[mid] == 1))
                    return mid+1;
        
                if (arr[mid] == 1)
                    return countOnes((mid + 1), high);
        
                return countOnes(low, (mid -1));
            }
            return 0;
        }
        
        int result = countOnes(0, arr.length - 1);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 4 ]));
});

test("Test 'min_adj_swaps.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int a[] = {
            5, 6, 1, 3
        };
        
        int solve(int n)
        {
            int maxx = -1, minn = a[0], l = 0, r = 0;
            for (int i = 0; i < n; i++) {
                if (a[i] > maxx) {
                    maxx = a[i];
                    l = i;
                }
         
                if (a[i] <= minn) {
                    minn = a[i];
                    r = i;
                }
            }
            if (r < l)
                return l + (n - r - 2);
            else
                return l + (n - r - 1);
        }
        
        int result = solve(a.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 2 ]));
});

test("Test 'emirp.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        uint answers[20];

        int is_prime(uint n)
        {
            if (!(n % 2u) || !(n % 3u)) 
                return 0;
        
            uint p = 1u;
        
            while(p * p < n)
                if (n % (p += 4u) == 0u || n % (p += 2u) == 0u)
                    return 0;
        
            return 1;
        }
         
        uint reverse(uint n)
        {
            uint r;
            for (r = 0u; n; n /= 10u)
                r = r * 10u + (n % 10u);
        
            return r;
        }
         
        int is_emirp(uint n)
        {
            uint r = reverse(n);
            return (int)(r != n) && is_prime(n) && is_prime(r);
        }
        
        void run()
        {
            uint x;
            int c = 0;
        
            for (x = 11u; c < answers.length; x += 2u)
                if (is_emirp(x))
                    answers[c++] = x;
        }
         
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_answers_0`)).toStrictEqual(new Int32Array([ 13 ]));
    expect(interpreter.memoryRegions.get(`var_answers_1`)).toStrictEqual(new Int32Array([ 17 ]));
    expect(interpreter.memoryRegions.get(`var_answers_2`)).toStrictEqual(new Int32Array([ 31 ]));
    expect(interpreter.memoryRegions.get(`var_answers_3`)).toStrictEqual(new Int32Array([ 37 ]));
    expect(interpreter.memoryRegions.get(`var_answers_4`)).toStrictEqual(new Int32Array([ 71 ]));
    expect(interpreter.memoryRegions.get(`var_answers_5`)).toStrictEqual(new Int32Array([ 73 ]));
    expect(interpreter.memoryRegions.get(`var_answers_6`)).toStrictEqual(new Int32Array([ 79 ]));
    expect(interpreter.memoryRegions.get(`var_answers_7`)).toStrictEqual(new Int32Array([ 97 ]));
    expect(interpreter.memoryRegions.get(`var_answers_8`)).toStrictEqual(new Int32Array([ 107 ]));
    expect(interpreter.memoryRegions.get(`var_answers_9`)).toStrictEqual(new Int32Array([ 113 ]));
    expect(interpreter.memoryRegions.get(`var_answers_10`)).toStrictEqual(new Int32Array([ 149 ]));
    expect(interpreter.memoryRegions.get(`var_answers_11`)).toStrictEqual(new Int32Array([ 157 ]));
    expect(interpreter.memoryRegions.get(`var_answers_12`)).toStrictEqual(new Int32Array([ 167 ]));
    expect(interpreter.memoryRegions.get(`var_answers_13`)).toStrictEqual(new Int32Array([ 179 ]));
    expect(interpreter.memoryRegions.get(`var_answers_14`)).toStrictEqual(new Int32Array([ 199 ]));
    expect(interpreter.memoryRegions.get(`var_answers_15`)).toStrictEqual(new Int32Array([ 311 ]));
    expect(interpreter.memoryRegions.get(`var_answers_16`)).toStrictEqual(new Int32Array([ 337 ]));
    expect(interpreter.memoryRegions.get(`var_answers_17`)).toStrictEqual(new Int32Array([ 347 ]));
    expect(interpreter.memoryRegions.get(`var_answers_18`)).toStrictEqual(new Int32Array([ 359 ]));
    expect(interpreter.memoryRegions.get(`var_answers_19`)).toStrictEqual(new Int32Array([ 389 ]));
});

test("Test 'min_jumps.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = { 1, 3, 6, 1, 0, 9 };
        int jumps[arr.length];
        
        const int INT_MAX = 2147483647;
        
        int minJumps(int n)
        {
            int min;
            jumps[n - 1] = 0;
         
            for (int i = n - 2; i >= 0; i--) {
                if (arr[i] == 0)
                    jumps[i] = INT_MAX;
                else if (arr[i] >= n - i - 1)
                    jumps[i] = 1;
                else {
                    min = INT_MAX;
        
                    for (int j = i + 1; j < n && j <= arr[i] + i; j++) {
                        if (min > jumps[j])
                            min = jumps[j];
                    }
        
                    if (min != INT_MAX)
                        jumps[i] = min + 1;
                    else
                        jumps[i] = min;
                }
            }
         
            return jumps[0];
        }
        
        int result = minJumps(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 3 ]));
});

test("Test 'min_insertions.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int str[] = { 61, 62, 63, 64, 65 };

        struct Table 
        {
            int a[str.length];
        };
        
        int min(int a, int b)
        {
            return a < b ? a : b;
        }
        
        int findMinInserts()
        {
            Table table[str.length];
            int first, last, gap;
        
            for (gap = 1; gap < str.length; ++gap)
            {
                first = 0;
                last = gap;
        
                while (last < str.length)
                {
                    if (str[first] == str[last])
                    {
                        table[first].a[last] = table[first + 1].a[last - 1];
                    }
                    else
                    {
                        table[first].a[last] = min(
                            table[first].a[last - 1],
                            table[first + 1].a[last]
                        ) + 1;
                    }
        
                    ++first; 
                    ++last;
                }
            }
        
            return table[0].a[str.length - 1];
        }
        
        int result = findMinInserts();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 4 ]));
});

test("Test 'is_inside_triangle.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        float abs (float i)
        {
            return i < 0.f ? -i : i;
        }
        
        float area(float x1, float y1, float x2, float y2, float x3, float y3)
        {
           return abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
        }
        
        int isInside(float x1, float y1, float x2, float y2, float x3, float y3, float x, float y)
        {  
           float A = area (x1, y1, x2, y2, x3, y3);  
           float A1 = area (x, y, x2, y2, x3, y3); 
           float A2 = area (x1, y1, x, y, x3, y3);  
           float A3 = area (x1, y1, x2, y2, x, y);
           
           return (A == A1 + A2 + A3);
        }
        
        int result = isInside(0.0, 0.0, 20.0, 0.0, 10.0, 30.0, 10.0, 15.0);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 1 ]));
});

test("Test 'unique_paths_in_a_grid_with_obstacles.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        struct Table
        {
            int a[3];
        };
        
        Table A[3];
        
        int uniquePathsWithObstacles()
        {
            int r = A.length;
            int c = A[0].a.length;
        
            if (A[0].a[0])
                return 0;
        
            A[0].a[0] = 1;
         
            for (int j = 1; j < c; j++) 
            {
                if (A[0].a[j] == 0) 
                {
                    A[0].a[j] = A[0].a[j - 1];
                }
                else 
                {
                    A[0].a[j] = 0;
                }
            }
         
            for (int i = 1; i < r; i++) 
            {
                if (A[i].a[0] == 0)
                {
                    A[i].a[0] = A[i - 1].a[0];
                }
                else
                {
                    A[i].a[0] = 0;
                }
            }
         
            for (int i = 1; i < r; i++) 
            {
                for (int j = 1; j < c; j++) 
                {
                    if (A[i].a[j] == 0) 
                    {
                        A[i].a[j] = A[i - 1].a[j] + A[i].a[j - 1];
                    }
                    else 
                    {
                        A[i].a[j] = 0;
                    }
                }
            }
         
            return A[r - 1].a[c - 1];
        }
        
        int result = uniquePathsWithObstacles();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 6 ]));
});

test("Test 'dijkstra_shortest_path.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        const int INT_MAX = 2147483647;

        struct Table 
        {
            int a[3];
        };
        
        Table graph[3];
        
        int dist[graph.length];
        int sptSet[graph.length];
        
        int minDistance()
        {
            int min = INT_MAX, min_index;
          
            for (int v = 0; v < graph.length; v++)
            {
                if (sptSet[v] == 0 && dist[v] <= min)
                {
                    min = dist[v];
                    min_index = v;
                }
            }
          
            return min_index;
        }
        
        void dijkstra(int src)
        {
            for (int i = 0; i < graph.length; i++)
            {
                dist[i] = INT_MAX; 
                sptSet[i] = 0;
            }
          
            dist[src] = 0;
          
            for (int count = 0; count < graph.length - 1; count++) 
            {
                int u = minDistance();
          
                sptSet[u] = 1;
          
                for (int v = 0; v < graph.length; v++)
                    if (!sptSet[v] && graph[u].a[v] && dist[u] != INT_MAX
                        && dist[u] + graph[u].a[v] < dist[v])
                        dist[v] = dist[u] + graph[u].a[v];
            }
        }
        
        void run()
        {
            graph[0].a[1] = 4;
            graph[1].a[0] = 4;
            graph[1].a[2] = 8;
            graph[2].a[1] = 8;
        
            dijkstra(0);
        }
        
        run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_dist_0`)).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.memoryRegions.get(`var_dist_1`)).toStrictEqual(new Int32Array([ 4 ]));
    expect(interpreter.memoryRegions.get(`var_dist_2`)).toStrictEqual(new Int32Array([ 12 ]));
});

test("Test 'lbs.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15};
        int lis[arr.length];
        int lds[arr.length];
        
        int lbs(int n)
        {
           int i, j;
         
           for (i = 0; i < n; i++)
              lis[i] = 1;
         
           for (i = 1; i < n; i++)
              for (j = 0; j < i; j++)
                 if (arr[i] > arr[j] && lis[i] < lis[j] + 1)
                    lis[i] = lis[j] + 1;
         
           for (i = 0; i < n; i++)
              lds[i] = 1;
        
           for (i = n-2; i >= 0; i--)
              for (j = n-1; j > i; j--)
                 if (arr[i] > arr[j] && lds[i] < lds[j] + 1)
                    lds[i] = lds[j] + 1;
         
           int max = lis[0] + lds[0] - 1;
           for (i = 1; i < n; i++)
             if (lis[i] + lds[i] - 1 > max)
                 max = lis[i] + lds[i] - 1;
        
           return max;
        }
        
        int result = lbs(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 7 ]));
});

test("Test 'optimal_cost_to_construct_binary_tree.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        const int INT_MAX = 2147483647;

        int freq[] = { 25, 10, 20 };
        
        struct Table 
        {
            int a[4];
        };
        
        Table cost[4];
        
        int min(int x, int y) 
        {
            return (x < y) ? x : y;
        }
         
        int findOptimalCost()
        {
            int n = cost.length - 1;
        
            for (int i = 0; i < n; i++) {
                cost[i].a[i] = freq[i];
            }
         
            for (int size = 1; size <= n; size++)
            {
                for (int i = 0; i <= n - size + 1; i++)
                {
                    int j = min(i + size - 1, n - 1);
                    cost[i].a[j] = INT_MAX;
        
                    for (int r = i; r <= j; r++)
                    {
                        int total = 0;
        
                        for (int k = i; k <= j; k++) {
                            total += freq[k];
                        }
         
                        if (r != i) {
                            total += cost[i].a[r - 1];
                        }
        
                        if (r != j) {
                            total += cost[r + 1].a[j];
                        }
        
                        cost[i].a[j] = min(total, cost[i].a[j]);
                    }
                }
            }
        
            return cost[0].a[n - 1];
        }
        
        int result = findOptimalCost();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 95 ]));
});

test("Test 'msi.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {1, 101, 2, 3, 100, 4, 5};
        int msis[arr.length];
        
        int maxSumIS(int n)
        {
            int i, j, max = 0;
        
            for ( i = 0; i < n; i++ )
                msis[i] = arr[i];
         
            for ( i = 1; i < n; i++ )
                for ( j = 0; j < i; j++ )
                    if (arr[i] > arr[j] &&
                        msis[i] < msis[j] + arr[i])
                        msis[i] = msis[j] + arr[i];
         
            for ( i = 0; i < n; i++ )
                if ( max < msis[i] )
                    max = msis[i];
         
            return max;
        }
         
        int result = maxSumIS(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 106 ]));
});

test("Test 'boyer_moore.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int badchar[256];
        
        int txt[] = { 1, 2, 3, 1, 2, 1 };
        int pat[] = { 1, 2, 1 };
        
        int result = 0;
        
        void badCharHeuristic()
        {
            int i;
        
            for (i = 0; i < badchar.length; i++)
                badchar[i] = -1;
        
            for (i = 0; i < pat.length; i++)
                badchar[pat[i]] = i;
        }
        
        int max(int a, int b)
        {
            return a > b ? a : b;
        }
         
        void search()
        {
            int m = pat.length;
            int n = txt.length;
         
            badCharHeuristic();
         
            int s = 0;
            while(s <= (n - m))
            {
                int j = m - 1;
                while(j >= 0 && pat[j] == txt[s + j])
                    j--;
        
                if (j < 0)
                {
                    result = s;
                    s += (s + m < n)? m-badchar[txt[s + m]] : 1;
                }
                else
                    s += max(1, j - badchar[txt[s + j]]);
            }
        }
         
        search();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Int32Array([ 3 ]));
});

test("Test 'bool.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int b = 0;

        void test()
        {
            int a = 0;
        
            if (a = 0)
            {
                b = 1;
            }
        }
        
        test();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_b`)).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test 'bool_inverse.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int b = 0;

        void test()
        {
            int a = 0;
            
            if (a = b + 2)
            {
                b = a;
            }
        }
        
        test();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_b`)).toStrictEqual(new Int32Array([ 2 ]));
});

test("Test 'multi_assignment.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int a = 0;
        int b = 0;
        
        void main()
        {
            a = (b = 2);
        }
        
        main();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_a`)).toStrictEqual(new Uint32Array([ 2 ]));
    expect(interpreter.memoryRegions.get(`var_b`)).toStrictEqual(new Uint32Array([ 2 ]));
});

test("Test 'fnv_hash.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        // "The quick brown fox"
        uint buf[] = { 
            0x54u, 0x68u, 0x65u, 0x20u, 0x71u, 0x75u, 0x69u, 
            0x63u, 0x6bu, 0x20u, 0x62u, 0x72u, 0x6fu, 0x77u, 
            0x6eu, 0x20u, 0x66u, 0x6fu, 0x78u
        };
        
        uint fnv_32_buf()
        {
            uint hval = 0x811c9dc5u;
            uint bp = 0u;
            uint be = bp + (uint)buf.length;
        
            while (bp < be) {
                hval *= 0x01000193u;
                hval ^= buf[bp++];
            }
        
            return hval;
        }
        
        uint fnv_32a_buf()
        {
            uint hval = 0x811c9dc5u;
            uint bp = 0u;
            uint be = bp + (uint)buf.length;
        
            while (bp < be) {
                hval ^= buf[bp++];
                hval *= 0x01000193u;
            }
        
            return hval;
        }
        
        uint result = fnv_32_buf();
        uint result_a = fnv_32a_buf();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 0xcb423604 ]));
    expect(interpreter.memoryRegions.get(`var_result_a`)).toStrictEqual(new Uint32Array([ 0xae4d67e2 ]));
});

test("Test 'atan_pi.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        const float LUT[102] = {
            0.0f,         0.0099996664f, 0.019997334f, 0.029991005f, 0.039978687f,
            0.049958397f, 0.059928156f,  0.069885999f, 0.079829983f, 0.089758173f,
            0.099668652f, 0.10955953f,   0.11942893f,  0.12927501f,  0.13909595f,
            0.14888994f,  0.15865526f,   0.16839015f,  0.17809294f,  0.18776195f,
            0.19739556f,  0.20699219f,   0.21655031f,  0.22606839f,  0.23554498f,
            0.24497867f,  0.25436807f,   0.26371184f,  0.27300870f,  0.28225741f,
            0.29145679f,  0.30060568f,   0.30970293f,  0.31874755f,  0.32773849f,
            0.33667481f,  0.34555557f,   0.35437992f,  0.36314702f,  0.37185606f,
            0.38050637f,  0.38909724f,   0.39762798f,  0.40609807f,  0.41450688f,
            0.42285392f,  0.43113875f,   0.43936089f,  0.44751999f,  0.45561564f,
            0.46364760f,  0.47161558f,   0.47951928f,  0.48735857f,  0.49513325f,
            0.50284320f,  0.51048833f,   0.51806855f,  0.52558380f,  0.53303409f,
            0.54041952f,  0.54774004f,   0.55499572f,  0.56218672f,  0.56931317f,
            0.57637525f,  0.58337301f,   0.59030676f,  0.59717667f,  0.60398299f,
            0.61072594f,  0.61740589f,   0.62402308f,  0.63057774f,  0.63707036f,
            0.64350110f,  0.64987046f,   0.65617871f,  0.66242629f,  0.66861355f,
            0.67474097f,  0.68080884f,   0.68681765f,  0.69276786f,  0.69865984f,
            0.70449406f,  0.71027100f,   0.71599114f,  0.72165483f,  0.72726268f,
            0.73281509f,  0.73831260f,   0.74375558f,  0.74914461f,  0.75448018f,
            0.75976276f,  0.76499283f,   0.77017093f,  0.77529752f,  0.78037310f,
            0.78539819f,  0.79037325f
        };
        
        const float M_PI_2 = 1.57079632679489661923;
        
        int round(float x)
        {
            if (x < 0.0)
                return (int)(x - 0.5);
            else
                return (int)(x + 0.5);
        }
         
        float atan(float x) 
        {
            if (x >= 0.0) 
            {
                if (x <= 1.0) 
                {
                    int index = round(x * 100.0);
                    return (LUT[index] + (x * 100.0 - (float)index) * (LUT[index + 1] - LUT[index]));
                } 
                else 
                {
                    float re_x = 1.0 / x;
                    int index = round(re_x * 100.0);
                    return (M_PI_2 - (LUT[index] + (re_x * 100.0 - (float)index) * (LUT[index + 1] - LUT[index])));
                }
            } 
            else 
            {
                if (x >= -1.0) 
                {
                    float abs_x = -x;
                    int index = round(abs_x * 100.0);
                    return -(LUT[index] + (abs_x * 100.0 - (float)index) * (LUT[index + 1] - LUT[index]));
                }
                else 
                {
                    float re_x = 1.0 / (-x);
                    int index = round(re_x * 100.0);
                    return (LUT[index] + (re_x * 100.0 - (float)index) * (LUT[index+1] - LUT[index])) - M_PI_2;
                }
            }
        }
        
        float result = atan(1.0) + atan(2.0) + atan(3.0);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Float32Array([ 3.141598701477051 ]));
});

test("Test 'viete_pi.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        float sqrt(float n) 
        { 
            float x = n; 
            float y = 1.0; 
            float e = 0.000001;
        
            while (x - y > e) 
            { 
                x = (x + y) / 2.0;
                y = n / x;
            } 
        
            return x; 
        } 
        
        float run()
        {
            float n, i, j;
            float f;
            float pi = 1.0;
        
            n = 100.0; 
            for(i = n; i > 1.0; i--) {
                f = 2.0;
                for(j = 1.0; j < i; j++){
                    f = 2.0 + sqrt(f);
                }
                f = sqrt(f);
                pi = pi * f / 2.0;
            }
            pi *= sqrt(2.0) / 2.0;
            pi = 2.0 / pi;
        
            return pi;
        }
        
        float result = run();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Float32Array([ 3.141590118408203 ]));
});

test("Test 'heap_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        
        void buildMaxHeap(int n)
        {
            for (int i = 1; i < n; i++)
            {
                if (arr[i] > arr[(i - 1) / 2])
                {
                    int j = i;
        
                    while (arr[j] > arr[(j - 1) / 2])
                    {
                        swap(j, (j - 1) / 2);
        
                        j = (j - 1) / 2;
                    }
                }
            }
        }
          
        void heapSort(int n)
        {
            buildMaxHeap(n);
        
            for (int i = n - 1; i > 0; i--)
            {
                swap(0, i);
        
                int j = 0, index;
        
                do
                {
                    index = 2 * j + 1;
        
                    if (index < (i - 1) && arr[index] < arr[index + 1])
                        index++;
        
                    if (index < i && arr[j] < arr[index])
                        swap(j, index);
        
                    j = index;
        
                } while (index < i);
            }
        }
        
        heapSort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'heap_sort_2.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        
        void heapInsert(int index) 
        {
            while (arr[index] > arr[(index - 1) / 2]) 
            {
                swap(index, (index - 1) / 2);
                index = (index - 1) / 2;
            }
        }
        
        void heapify(int index, int size)
        {
            int left = index * 2 +1;
            while (left < size) 
            {
                int largest = left + 1 < size && arr[left + 1] > arr[left] ? left + 1 : left;
                largest = arr[largest] > arr[index] ? largest : index;
        
                if (largest == index) 
                {
                    break;
                }
        
                swap(largest, index);
                index = largest;
                left = index * 2 + 1; 
            }
        }
        
        void heapSort(int length) 
        {
            if (length < 2) 
            {
                return;
            }
        
            for (int i = 0; i < length; i++) 
            {
                heapInsert(i);
            }
        
            int heapSize = length;
            swap(0, --heapSize);
        
            while (heapSize > 0) 
            {
                heapify(0, heapSize);
                swap(0 , --heapSize);
            }
        }
        
        heapSort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'radix_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        int output[arr.length];
        
        int getMax(int n)
        {
            int mx = arr[0];
        
            for (int i = 1; i < n; i++)
                if (arr[i] > mx)
                    mx = arr[i];
        
            return mx;
        }
         
        void countSort(int n, int exp) 
        {
            int i, count[10] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            
            for (i = 0; i < n; i++)
                count[(arr[i] / exp) % 10]++;
                
            for (i = 1; i < 10; i++)
                count[i] += count[i - 1];
         
            for (i = n - 1; i >= 0; i--) {
                output[count[(arr[i] / exp) % 10] - 1] = arr[i];
                count[(arr[i] / exp) % 10]--;
            }
            
            for (i = 0; i < n; i++)
                arr[i] = output[i];
        }
         
        void radixsort(int n)
        {
            int m = getMax(n);
         
            for (int exp = 1; m / exp > 0; exp *= 10)
                countSort(n, exp);
        }
        
        radixsort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_output_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'odd_even_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void oddEvenSort()
        {
            int n = arr.length;
            int isSorted = 0;
        
            while (!isSorted)
            {
                isSorted = 1;
                int temp = 0;
        
                for (int i = 1; i <= n - 2; i = i + 2)
                {
                    if (arr[i] > arr[i+1])
                    {
                        temp = arr[i];
                        arr[i] = arr[i+1];
                        arr[i+1] = temp;
                        isSorted = 0;
                    }
                }
        
                for (int i = 0; i <= n - 2; i = i + 2)
                {
                    if (arr[i] > arr[i+1])
                    {
                        temp = arr[i];
                        arr[i] = arr[i+1];
                        arr[i+1] = temp;
                        isSorted = 0;
                    }
                }
            }
        }
        
        oddEvenSort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'shell_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void shellSort()
        {
            int n = arr.length;
        
            for (int gap = n/2; gap > 0; gap /= 2)
            {
                for (int i = gap; i < n; i += 1)
                {
                    int temp = arr[i];
         
                    int j;           
                    for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                        arr[j] = arr[j - gap];
        
                    arr[j] = temp;
                }
            }
        }
        
        shellSort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'comb_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int a[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        
        int getNextGap(int gap)
        {
            gap = (gap * 10) / 13;
         
            if (gap < 1)
                return 1;
            return gap;
        }
        
        void combSort()
        {
            int n = a.length;
            int gap = n;
         
            int swapped = 1;
         
            while (gap != 1 || swapped == 1)
            {
                gap = getNextGap(gap);    
                swapped = 0;
         
                for (int i = 0; i < n - gap; i++)
                {
                    if (a[i] > a[i + gap])
                    {
                        swap(i, i + gap);
                        swapped = 1;
                    }
                }
            }
        }
        
        combSort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_a_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'pancake_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void flip(int i)
        {
            int temp, start = 0;
        
            while (start < i) 
            {
                temp = arr[start];
                arr[start] = arr[i];
                arr[i] = temp;
                start++;
                i--;
            }
        }
        
        int findMax(int n)
        {
            int mi = 0, i = 0;
            
            for (; i < n; ++i)
                if (arr[i] > arr[mi])
                    mi = i;
        
            return mi;
        }
         
        void pancakeSort(int n)
        {
            for (int curr_size = n; curr_size > 1; --curr_size)
            {
                int mi = findMax(curr_size);
         
                if (mi != curr_size - 1) 
                {
                    flip(mi);
                    flip(curr_size - 1);
                }
            }
        }
         
        pancakeSort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'cocktail_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int a[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        
        void CocktailSort(int n)
        {
            int swapped = 1;
            int start = 0;
            int end = n - 1;
         
            while (swapped)
            {
                swapped = 0;
        
                for (int i = start; i < end; ++i)
                {
                    if (a[i] > a[i + 1]) {
                        swap(i, i + 1);
                        swapped = 1;
                    }
                }
        
                if (!swapped)
                    break;
        
                swapped = 0;
                --end;
        
                for (int i = end - 1; i >= start; --i)
                {
                    if (a[i] > a[i + 1]) {
                        swap(i, i + 1);
                        swapped = 1;
                    }
                }
        
                ++start;
            }
        }
        
        CocktailSort(a.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_a_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'counting_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        int output[36];
        int count[256];
        
        void countsort()
        {
            int n = arr.length;
        
            for (int i = 0; i < 256; ++i)
                count[i] = 0;
        
            for (int i = 0; i < n; ++i)
                ++count[arr[i]];
        
            for (int i = 1; i <= 255; ++i)
                count[i] += count[i - 1];
        
            for (int i = n - 1; i >= 0; i--) {
                output[count[arr[i]] - 1] = arr[i];
                --count[arr[i]];
            }
        
            for (int i = 0; i < n; ++i)
                arr[i] = output[i];
        }
        
        countsort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'pigeonhole_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        int phole[100];
        
        void pigeonhole_sort(int n)
        {
            int min = arr[0];
            int max = arr[0];
            int range, i, j, index;
         
            for(int a = 0; a < n; a++)
            {
                if(arr[a] > max)
                    max = arr[a];
                if(arr[a] < min)
                    min = arr[a];
            }
         
            range = max - min + 1;
            
             
            for(i = 0; i < n; i++)
            phole[i] = 0;
         
            for(i = 0; i < n; i++)
                phole[arr[i] - min]++;
         
             
            index = 0;
         
            for(j = 0; j < range; j++)
                while(phole[j] --> 0)
                    arr[index++] = j + min;
         
        }
        
        pigeonhole_sort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Int32Array([ value ]));
    });
});

test("Test 'tim_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        const int RUN = 32; 
          
        void insertionSort(int left, int right) 
        { 
            for (int i = left + 1; i <= right; i++) 
            { 
                int temp = arr[i]; 
                int j = i - 1; 
                while (j >= left && arr[j] > temp) 
                { 
                    arr[j+1] = arr[j]; 
                    j--; 
                } 
                arr[j+1] = temp; 
            } 
        } 
          
        void merge(int l, int m, int r) 
        { 
            int len1 = m - l + 1, len2 = r - m; 
            int left[36], right[36]; 
            for (int i = 0; i < len1; i++) 
                left[i] = arr[l + i]; 
            for (int i = 0; i < len2; i++) 
                right[i] = arr[m + 1 + i]; 
          
            int i = 0; 
            int j = 0; 
            int k = l; 
          
            while (i < len1 && j < len2) 
            { 
                if (left[i] <= right[j]) 
                { 
                    arr[k] = left[i]; 
                    i++; 
                } 
                else
                { 
                    arr[k] = right[j]; 
                    j++; 
                } 
                k++; 
            } 
          
            while (i < len1) 
            { 
                arr[k] = left[i]; 
                k++; 
                i++; 
            } 
          
            while (j < len2) 
            { 
                arr[k] = right[j]; 
                k++; 
                j++; 
            } 
        } 
        
        int min(int a, int b)
        {
            return a < b ? a : b;
        }
          
        void timSort(int n) 
        {  
            for (int i = 0; i < n; i+=RUN) 
                insertionSort(i, min((i+31), (n-1))); 
          
            for (int size = RUN; size < n; size = 2*size) 
            { 
                for (int left = 0; left < n; left += 2*size) 
                { 
                    int mid = left + size - 1; 
                    int right = min((left + 2*size - 1), (n-1)); 
        
                    merge(left, mid, right); 
                } 
            } 
        } 
        
        timSort(arr.length);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'gnome_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void gnomeSort()
        {
            int n = arr.length;
            int index = 0;
        
            while (index < n)
            {
                if (index == 0)
                    index++;
                if (arr[index] >= arr[index - 1])
                    index++;
                else {
                    int temp = 0;
                    temp = arr[index];
                    arr[index] = arr[index - 1];
                    arr[index - 1] = temp;
                    index--;
                }
            }
        }
        
        gnomeSort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_arr_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'shaker_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int a[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        void swap(int i, int j) 
        {
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        
        void shakersort()
        {
            int n = a.length;
            int p, i;
            for (p = 1; p <= n / 2; p++)
            {
                for (i = p - 1; i < n - p; i++)
                    if (a[i] > a[i + 1])
                    {
                        swap(i, i + 1);
                    }
                for (i = n - p - 1; i >= p; i--)
                    if (a[i] < a[i - 1])
                    {
                        swap(i, i - 1);
                    }
            }
        }
        
        shakersort();
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    const sortedList = [
        55, 47, 35, 15, 20, 42,
        52, 30, 58, 15, 13, 19,
        32, 18, 44, 11, 7, 9,
        34, 56, 17, 25, 14, 48,
        40, 4, 5, 7, 36, 1,
        33, 49, 25, 26, 30, 9
    ].sort((a, b) => a - b);

    sortedList.forEach((value, index) =>
    {
        expect(interpreter.memoryRegions.get(`var_a_${index}`))
            .toStrictEqual(new Uint32Array([ value ]));
    });
});

test("Test 'bisection.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        const float EPSILON = 0.01f;
        const float NaN = (float)0xffffffffu;
        
        float func(float x)
        {
            return x * x * x - x * x + 2.f;
        }
         
        float bisection(float a, float b)
        {
            if (func(a) * func(b) >= 0.f)
            {
                return NaN;
            }
         
            float c = a;
            while ((b-a) >= EPSILON)
            {
                c = (a + b) / 2.f;
         
                if (func(c) == 0.0)
                    break;
         
                else if (func(c) * func(a) < 0.f)
                    b = c;
                else
                    a = c;
            }
        
            return c;
        }
        
        float result = bisection(-200.f, 300.f);
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Float32Array([ -1.00250244140625 ]));
});

test("Test 'constant_array_size.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        int arr2[arr.length];
        
        struct Test {
            int arr[arr2.length];
        };
        
        Test test;
    `);

    const interpreter = new Interpreter(result);
    await interpreter.run();

    for (let i = 0; i < 36; i++)
    {
        expect(interpreter.memoryRegions.get(`var_arr_${i}`)).toBeDefined();
        expect(interpreter.memoryRegions.get(`var_arr2_${i}`)).toStrictEqual(new Uint32Array([ 0 ]));
        expect(interpreter.memoryRegions.get(`var_test__arr_${i}`)).toStrictEqual(new Uint32Array([ 0 ]));
    }
});

test("Test 'monte_carlo_pi.c'.", async () => {
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
    await interpreter.run();

    expect(interpreter.memoryRegions.get(`var_answer`)).toStrictEqual(new Float32Array([ 3.147599935531616 ]));
});