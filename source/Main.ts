import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start()
    {
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
        //await interpreter.run();
        console.log(interpreter.memoryRegions);
    }
}

Main.start();