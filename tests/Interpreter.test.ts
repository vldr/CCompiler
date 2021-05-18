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

test("Test POPNOP, POP, GETPOPA, GETPOPB, GETPOPR, MOVINPOP.", () => {
    const interpreter = new Interpreter(`
            VPUSH var_b
            VPUSH 128
            VPUSH 64
            VPUSH 32      
            VPUSH 16
            VPUSH 0
            
          
            POPNOP
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

test("Test SAVE, SAVEA, SAVEB, SAVETOA, SAVETOB.", () => {
    const interpreter = new Interpreter(`
            VPUSH 128
            VPUSH 64
            VPUSH 32
            
            GETPOPA
            GETPOPB
            GETPOPR
            
            SAVE var_a
            SAVEA var_b
            SAVEB var_c
            
            SAVETOA
            SAVETOB
           
            HALT
            
            var_a:
            .data 0
            
            var_b:
            .data 0
            
            var_c:
            .data 0
        `);
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 32 ]));
    expect(interpreter.memoryRegions.get("var_c")).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 128 ]));
});

test("Test JMP.", () => {
    const interpreter = new Interpreter(`
            JMP test
            HALT
            
            test:
            VGETA 128
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
});

test("Test CALL, RTN.", () => {
    const interpreter = new Interpreter(`
            CALL test
            VGETB 64
            HALT
            
            test:
            VGETA 128
            RTN
        `);
    interpreter.run();

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 64 ]));
});

test("Test JA, JNA.", () => {
    let interpreter = new Interpreter(`
                VGETA 6.4f
                JA true
            false:
                VGETB 0
                JMP finish
            true:
                VGETB 1
            finish:
                HALT
        `);
    interpreter.run();

    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 1 ]));

    interpreter = new Interpreter(`
                VGETA 0
                JNA false
            true:
                VGETB 0
                JMP finish
            false:
                VGETB 1
            finish:
                HALT
        `);
    interpreter.run();

    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 1 ]));
});

test("Test MOV.", () => {
    const interpreter = new Interpreter(`
            MOV var_a var_b
            HALT
            
            var_a:
            .data 16
            
            var_b:
            .data 0
        `);
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test MOVIN.", () => {
    const interpreter = new Interpreter(`
            VPUSH var_b
            GETPOPR
            MOVIN var_a     
            HALT
            
            var_a:
            .data 16
            
            var_b:
            .data 0
        `);
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test MOVOUT.", () => {
    const interpreter = new Interpreter(`
            VPUSH var_a
            GETPOPR
            MOVOUT var_b     
            HALT
            
            var_a:
            .data 16
            
            var_b:
            .data 0
        `);
    interpreter.run();

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test ADD.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB 20
            ADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 30 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB 20
            ADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 10 ]));
});

test("Test SADD.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB 20
            SADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 30 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB 20
            SADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 10 ]));
});

test("Test FADD.", () => {
    let interpreter = new Interpreter(`
            VGETA 12.5f
            VGETB 22.5f
            FADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 35 ]));

    interpreter = new Interpreter(`
            VGETA -10f
            VGETB 20f
            FADD
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 10 ]));
});

test("Test SUB.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB 20
            SUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ -10 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB 20
            SUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ -30 ]));
});

test("Test SSUB.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB -20
            SSUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 30 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB 20
            SSUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -30 ]));
});

test("Test FSUB.", () => {
    let interpreter = new Interpreter(`
            VGETA 10.5f
            VGETB -20.5f
            FSUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 31 ]));

    interpreter = new Interpreter(`
            VGETA -10.5f
            VGETB 20.5f
            FSUB
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -31 ]));
});

test("Test DIV.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB 2
            DIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 5 ]));

    interpreter = new Interpreter(`
            VGETA 2
            VGETB 3
            DIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SDIV.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB -2
            SDIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -5 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB -10
            SDIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 1 ]));
});

test("Test FDIV.", () => {
    let interpreter = new Interpreter(`
            VGETA 11f
            VGETB -2f
            FDIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -5.5 ]));

    interpreter = new Interpreter(`
            VGETA -10f
            VGETB -10f
            FDIV
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 1 ]));
});

test("Test MULT.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB 2
            MULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 20 ]));

    interpreter = new Interpreter(`
            VGETA 0
            VGETB 3
            MULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SMULT.", () => {
    let interpreter = new Interpreter(`
            VGETA 10
            VGETB -2
            SMULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -20 ]));

    interpreter = new Interpreter(`
            VGETA -10
            VGETB -10
            SMULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 100 ]));
});

test("Test FMULT.", () => {
    let interpreter = new Interpreter(`
            VGETA 10f
            VGETB -2f
            FMULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -20 ]));

    interpreter = new Interpreter(`
            VGETA -10f
            VGETB -10f
            FMULT
            HALT
        `);
    interpreter.run();

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 100 ]));
});

test("Test CMPE, CMPNE, CMPLT, CMPLTE, CMPGT, CMPGTE", () => {
    const interpreter = new Interpreter(`
            VGETA 10
            VGETB 20
            
            CMPE
            SAVEPUSH
            
            CMPNE
            SAVEPUSH
            
            CMPLT
            SAVEPUSH
            
            CMPLTE
            SAVEPUSH
            
            CMPGT
            SAVEPUSH
            
            CMPGTE
            SAVEPUSH

            HALT
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SCMPE, SCMPNE, SCMPLT, SCMPLTE, SCMPGT, SCMPGTE", () => {
    const interpreter = new Interpreter(`
            VGETA 10
            VGETB -20
            
            SCMPE
            SAVEPUSH
            
            SCMPNE
            SAVEPUSH
            
            SCMPLT
            SAVEPUSH
            
            SCMPLTE
            SAVEPUSH
            
            SCMPGT
            SAVEPUSH
            
            SCMPGTE
            SAVEPUSH

            HALT
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test FCMPE, FCMPNE, FCMPLT, FCMPLTE, FCMPGT, FCMPGTE", () => {
    const interpreter = new Interpreter(`
            VGETA 10.25f
            VGETB -20f
            
            FCMPE
            SAVEPUSH
            
            FCMPNE
            SAVEPUSH
            
            FCMPLT
            SAVEPUSH
            
            FCMPLTE
            SAVEPUSH
            
            FCMPGT
            SAVEPUSH
            
            FCMPGTE
            SAVEPUSH

            HALT
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test NEG, SNEG, FNEG", () => {
    const interpreter = new Interpreter(`
            VGETA 128
            NEG
            SAVEPUSH
            
            VGETA 0
            NEG
            SAVEPUSH
            
            VGETA 100
            SNEG
            SAVEPUSH
            
            VGETA -100
            SNEG
            SAVEPUSH
            
            VGETA 10.5f
            FNEG
            SAVEPUSH
            
            VGETA -10.5f
            FNEG
            SAVEPUSH

            HALT
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ -10.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 100 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ -100 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test INC, FINC, DEC, FDEC", () => {
    const interpreter = new Interpreter(`
            VGETA 128
            INC
            SAVEPUSH
            
            VGETA 0
            DEC
            SAVEPUSH
            
            VGETA 100.5f
            FINC
            SAVEPUSH
            
            VGETA 50.5f
            FDEC
            SAVEPUSH

            HALT
        `);
    interpreter.run();

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 49.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 101.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ -1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 129 ]));
});