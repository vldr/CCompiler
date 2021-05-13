const fs = require('fs');
const peg = require("pegjs");

const INPUT_FILE_NAME = "c15s.pegjs";
const OUTPUT_FILE_NAME = "parser.umd.js";

const data = fs.readFileSync(INPUT_FILE_NAME, 'utf8')
const parser = peg.generate(data, { output: "source" });

const generatedParser = `(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const pegjs = ${parser};
    exports.parse = pegjs.parse;
    exports.SyntaxError = pegjs.SyntaxError;
});`;

fs.writeFileSync(OUTPUT_FILE_NAME, generatedParser);
