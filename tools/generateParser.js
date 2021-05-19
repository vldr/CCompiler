const fs = require("fs");
const peg = require("pegjs");
const path = require("path");

const INPUT_FILE_NAME = "parser/c15s.pegjs";

const OUTPUT_FOLDER = "dist/parser/";
const OUTPUT_FILE_NAME = OUTPUT_FOLDER + "parser.js";

const OUTPUT_FILE_NAME_2 = "parser/parser.js";

const data = fs.readFileSync(INPUT_FILE_NAME, 'utf8')
const parser = peg.generate(data, { output: "source" });

fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
fs.writeFileSync(OUTPUT_FILE_NAME, `module.exports = ${parser}`);
fs.writeFileSync(OUTPUT_FILE_NAME_2, `module.exports = ${parser}`);
