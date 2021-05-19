import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        //console.log(result);

//         const compiler = new Compiler();
//         const result = compiler.compile(`
//         int array[] = {
//     55, 47, 35, 15, 20, 42,
//     52, 30, 58, 15, 13, 19,
//     32, 18, 44, 11, 7, 9,
//     34, 56, 17, 25, 14, 48,
//     40, 4, 5, 7, 36, 1,
//     33, 49, 25, 26, 30, 9
// };
//
// void swap(int i, int j)
// {
//     int temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
// }
//
// int partition(int l, int h)
// {
//     int x = array[h];
//     int i = (l - 1);
//
//     for (int j = l; j <= h - 1; j++)
//     {
//         if (array[j] <= x)
//         {
//             i++;
//             swap(i, j);
//         }
//     }
//     swap(i + 1, h);
//
//     return (i + 1);
// }
//
// void qsort(int l, int h)
// {
//     _push(l);
//     _push(h);
//
//     int top = 2;
//
//     while (top > 0)
//     {
//         h = _pop_int();
//         l = _pop_int();
//
//         top -= 2;
//
//         int p = partition(l, h);
//
//         if (p > 0 && p - 1 > l)
//         {
//             _push(l);
//             _push(p - 1);
//
//             top += 2;
//         }
//
//         if (p + 1 < h)
//         {
//             _push(p + 1);
//             _push(h);
//
//             top += 2;
//         }
//     }
// }
//
// qsort(0, array.length - 1);
//
//         `);

        const interpreter = new Interpreter(`QSTORE 0 qsort_var_l
VGETA 36
VGETB 1
SSUB
SAVE qsort_var_h
CALL fn_qsort
HALT

fn_swap:
GETA swap_var_i
VGETB var_array
SADD
MOVOUT swap_var_temp
GETA swap_var_i
VGETB var_array
SADD
SAVEPUSH
GETA swap_var_j
VGETB var_array
SADD
MOVOUTPUSH
GETPOPR
MOVINPOP
GETA swap_var_j
VGETB var_array
SADD
SAVEPUSH
PUSH swap_var_temp
GETPOPR
MOVINPOP
RTN

fn_partition:
GETA partition_var_h
VGETB var_array
SADD
MOVOUT partition_var_x
GETA partition_var_l
VGETB 1
SSUB
SAVE partition_var_i
MOV partition_var_l partition_for_loop_0_var_j
partition_for_loop_0:
GETA partition_var_h
VGETB 1
SSUB
SAVETOB
GETA partition_for_loop_0_var_j
SCMPLTE
SAVETOA
JNA partition_for_loop_0_finish
GETA partition_for_loop_0_var_j
VGETB var_array
SADD
MOVOUTPUSH
GETPOPA
GETB partition_var_x
SCMPLTE
SAVETOA
JNA partition_for_loop_0_if_statement_0_alternate
GETA partition_var_i
INC
SAVE partition_var_i
MOV partition_var_i swap_var_i
MOV partition_for_loop_0_var_j swap_var_j
CALL fn_swap
JMP partition_for_loop_0_if_statement_0_finish
partition_for_loop_0_if_statement_0_alternate:
partition_for_loop_0_if_statement_0_finish:
partition_for_loop_0_increment:
GETA partition_for_loop_0_var_j
INC
SAVE partition_for_loop_0_var_j
JMP partition_for_loop_0
partition_for_loop_0_finish:
GETA partition_var_i
VGETB 1
SADD
SAVE swap_var_i
MOV partition_var_h swap_var_j
CALL fn_swap
GETA partition_var_i
VGETB 1
SADD
SAVEPUSH
RTN

fn_qsort:
PUSH qsort_var_l
PUSH qsort_var_h
QSTORE 2 qsort_var_top
qsort_while_loop_0:
GETA qsort_var_top
VGETB 0
SCMPGT
SAVETOA
JNA qsort_while_loop_0_finish
POP qsort_var_h
POP qsort_var_l
GETA qsort_var_top
VGETB 2
SSUB
SAVE qsort_var_top
MOV qsort_var_l partition_var_l
MOV qsort_var_h partition_var_h
CALL fn_partition
POP qsort_while_loop_0_var_p
GETA qsort_while_loop_0_var_p
VGETB 0
SCMPGT
SAVEPUSH
GETA qsort_while_loop_0_var_p
VGETB 1
SSUB
SAVETOA
GETB qsort_var_l
SCMPGT
SAVETOB
GETPOPA
LAND
SAVETOA
JNA qsort_while_loop_0_if_statement_0_alternate
PUSH qsort_var_l
GETA qsort_while_loop_0_var_p
VGETB 1
SSUB
SAVEPUSH
GETA qsort_var_top
VGETB 2
SADD
SAVE qsort_var_top
JMP qsort_while_loop_0_if_statement_0_finish
qsort_while_loop_0_if_statement_0_alternate:
qsort_while_loop_0_if_statement_0_finish:
GETA qsort_while_loop_0_var_p
VGETB 1
SADD
SAVETOA
GETB qsort_var_h
SCMPLT
SAVETOA
JNA qsort_while_loop_0_if_statement_1_alternate
GETA qsort_while_loop_0_var_p
VGETB 1
SADD
SAVEPUSH
PUSH qsort_var_h
GETA qsort_var_top
VGETB 2
SADD
SAVE qsort_var_top
JMP qsort_while_loop_0_if_statement_1_finish
qsort_while_loop_0_if_statement_1_alternate:
qsort_while_loop_0_if_statement_1_finish:
JMP qsort_while_loop_0
qsort_while_loop_0_finish:
RTN

var_array:
.data 55
.read var_array_0 var_array_0
var_array_1:
.data 47
.read var_array_1 var_array_1
var_array_2:
.data 35
.read var_array_2 var_array_2
var_array_3:
.data 15
.read var_array_3 var_array_3
var_array_4:
.data 20
.read var_array_4 var_array_4
var_array_5:
.data 42
.read var_array_5 var_array_5
var_array_6:
.data 52
.read var_array_6 var_array_6
var_array_7:
.data 30
.read var_array_7 var_array_7
var_array_8:
.data 58
.read var_array_8 var_array_8
var_array_9:
.data 15
.read var_array_9 var_array_9
var_array_10:
.data 13
.read var_array_10 var_array_10
var_array_11:
.data 19
.read var_array_11 var_array_11
var_array_12:
.data 32
.read var_array_12 var_array_12
var_array_13:
.data 18
.read var_array_13 var_array_13
var_array_14:
.data 44
.read var_array_14 var_array_14
var_array_15:
.data 11
.read var_array_15 var_array_15
var_array_16:
.data 7
.read var_array_16 var_array_16
var_array_17:
.data 9
.read var_array_17 var_array_17
var_array_18:
.data 34
.read var_array_18 var_array_18
var_array_19:
.data 56
.read var_array_19 var_array_19
var_array_20:
.data 17
.read var_array_20 var_array_20
var_array_21:
.data 25
.read var_array_21 var_array_21
var_array_22:
.data 14
.read var_array_22 var_array_22
var_array_23:
.data 48
.read var_array_23 var_array_23
var_array_24:
.data 40
.read var_array_24 var_array_24
var_array_25:
.data 4
.read var_array_25 var_array_25
var_array_26:
.data 5
.read var_array_26 var_array_26
var_array_27:
.data 7
.read var_array_27 var_array_27
var_array_28:
.data 36
.read var_array_28 var_array_28
var_array_29:
.data 1
.read var_array_29 var_array_29
var_array_30:
.data 33
.read var_array_30 var_array_30
var_array_31:
.data 49
.read var_array_31 var_array_31
var_array_32:
.data 25
.read var_array_32 var_array_32
var_array_33:
.data 26
.read var_array_33 var_array_33
var_array_34:
.data 30
.read var_array_34 var_array_34
var_array_35:
.data 9
.read var_array_35 var_array_35
swap_var_i:
.data 0
.read swap_var_i swap_var_i
swap_var_j:
.data 0
.read swap_var_j swap_var_j
swap_var_temp:
.data 0
.read swap_var_temp swap_var_temp
partition_var_l:
.data 0
.read partition_var_l partition_var_l
partition_var_h:
.data 0
.read partition_var_h partition_var_h
partition_var_x:
.data 0
.read partition_var_x partition_var_x
partition_var_i:
.data 0
.read partition_var_i partition_var_i
partition_for_loop_0_var_j:
.data 0
.read partition_for_loop_0_var_j partition_for_loop_0_var_j
qsort_var_l:
.data 0
.read qsort_var_l qsort_var_l
qsort_var_h:
.data 0
.read qsort_var_h qsort_var_h
qsort_var_top:
.data 0
.read qsort_var_top qsort_var_top
qsort_while_loop_0_var_p:
.data 0
.read qsort_while_loop_0_var_p qsort_while_loop_0_var_p`);
        interpreter.run();
    }
}

Main.start();