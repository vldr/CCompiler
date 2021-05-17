import Interpreter from "../source/Interpreter";

describe('Test GETA, GETB, VGETA, VGETB instructions.', () =>
{
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

});