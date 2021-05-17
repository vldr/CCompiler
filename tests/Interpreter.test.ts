import Interpreter from "../source/Interpreter";

test("Test GETA, GETB.", () => {
    const interpreter = new Interpreter(`
            GETA var_a
            GETB var_b
            HALT
            
            var_a:
            .data 10.25f
            
            var_b:
            .data 5
        `);
    interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Float32Array([ 10.25 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 5 ]));
});

test("Test VGETA, VGETB.", () => {
    const interpreter = new Interpreter(`
            VGETA 7
            VGETB 15.25f
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 7 ]));
    expect(interpreter.registerB).toStrictEqual(new Float32Array([ 15.25 ]));
});

test("Test PUSH, VPUSH, STOREPUSH, SAVEPUSH.", () => {
    const interpreter = new Interpreter(`
            STOREPUSH 289f
            PUSH var_a
            VPUSH 12
            
            VPUSH 69
            GETPOPR
            SAVEPUSH
            
            HALT
            
            var_a:
            .data 10.25f
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 69 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 12 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.25 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 289 ]));
});

test("Test MOVOUTPUSH.", () => {
    const interpreter = new Interpreter(`
            VPUSH var_a
            GETPOPR
            MOVOUTPUSH            
            HALT
            
            var_a:
            .data 10.25f
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.25 ]));
});

test("Test POP, GETPOPA, GETPOPB, GETPOPR, MOVINPOP.", () => {
    const interpreter = new Interpreter(`
            VPUSH var_b
            
            VPUSH 128
            VPUSH 64
            VPUSH 32
            
            VPUSH 16
            
            POP var_a
            
            GETPOPA
            GETPOPB
            GETPOPR
            
            MOVINPOP

            HALT
            
            var_a:
            .data 0
            
            var_b:
            .data 0
        `);
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 32 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 128 ]));
});