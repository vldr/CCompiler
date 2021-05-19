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

    console.log(result);

    const interpreter = new Interpreter(result);
    interpreter.run();

    //expect(interpreter.memoryRegions.get("var_result")).toStrictEqual(new Int32Array([ 0x1b346c90 ]));
});