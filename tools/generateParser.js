const fs = require('fs');
const peg = require("pegjs");

const INPUT_FILE_NAME = "../parser/c15s.pegjs";
const OUTPUT_FILE_NAME = "../parser/parser.umd.js";

const data = fs.readFileSync(INPUT_FILE_NAME, 'utf8')
const parser = peg.generate(data, { output: "source" });

fs.writeFileSync(OUTPUT_FILE_NAME, `module.exports = ${parser}`);
