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
        RentalRequest A[4];
        
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
        int results[9];
        
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

test("Test 'min_jumps.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[6] = { 1, 3, 6, 1, 0, 9 };
        int jumps[6];
        
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

test("Test 'lbs.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[16] = {0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15};
        int lis[16];
        int lds[16];
        
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

test("Test 'msi.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[7] = {1, 101, 2, 3, 100, 4, 5};
        int msis[7];
        
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

test("Test 'radix_sort.c'.", async () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        int arr[36] = {
            55, 47, 35, 15, 20, 42,
            52, 30, 58, 15, 13, 19,
            32, 18, 44, 11, 7, 9,
            34, 56, 17, 25, 14, 48,
            40, 4, 5, 7, 36, 1,
            33, 49, 25, 26, 30, 9
        };
        
        int output[36];
        
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