import Interpreter from "../source/Interpreter";
import Compiler from "../source/Compiler";

test("Test 'fib.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_result")).toStrictEqual(new Int32Array([ 2584 ]));
});

test("Test 'sqrt.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_result")).toStrictEqual(new Int32Array([ 0x1b346c90 ]));
});

test("Test 'quick_sort.c'.", () => {
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
    interpreter.run();

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

test("Test 'selection_sort.c'.", () => {
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
    interpreter.run();

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

test("Test 'cosine.c'.", () => {
    const compiler = new Compiler();
    const result = compiler.compile(`
        /* Credits to http://web.eecs.utk.edu/~azh/blog/cosine.html */
        const float CONST_PI = 3.141592653589793;
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
    interpreter.run();

    expect(interpreter.memoryRegions.get(`var_angles_0`)).toStrictEqual(new Float32Array([ 1.000000 ]));
    expect(interpreter.memoryRegions.get(`var_angles_1`)).toStrictEqual(new Float32Array([ 0.9092974662780762 ]));
    expect(interpreter.memoryRegions.get(`var_angles_2`)).toStrictEqual(new Float32Array([ 0.7071067690849304 ]));
    expect(interpreter.memoryRegions.get(`var_angles_3`)).toStrictEqual(new Float32Array([ 0.49999991059303284 ]));
    expect(interpreter.memoryRegions.get(`var_angles_4`)).toStrictEqual(new Float32Array([ -6.247336870046638e-8 ]));
});

test("Test 'mod_pow.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get(`var_result`)).toStrictEqual(new Uint32Array([ 0xe ]));
});

test("Test 'crc32.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get(`var_crc32`)).toStrictEqual(new Uint32Array([ 0xb3ae97b6 ]));
});

test("Test 'xtea.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get(`var_v_0`)).toStrictEqual(new Uint32Array([ 104 ]));
    expect(interpreter.memoryRegions.get(`var_v_1`)).toStrictEqual(new Uint32Array([ 105 ]));
});

test("Test 'bcd.c'.", () => {
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
    interpreter.run();

    expect(interpreter.memoryRegions.get(`var_bcd`)).toStrictEqual(new Uint32Array([ 0x05122021 ]));
});