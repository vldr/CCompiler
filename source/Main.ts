import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
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
        ].sort();

        console.log(interpreter.memoryRegions.get(`var_array_1`));
    }
}

Main.start();