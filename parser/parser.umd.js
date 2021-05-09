(function (factory) {
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
    const pegjs =
        (function() {
            "use strict";

            function peg$subclass(child, parent) {
                function ctor() { this.constructor = child; }
                ctor.prototype = parent.prototype;
                child.prototype = new ctor();
            }

            function peg$SyntaxError(message, expected, found, location) {
                this.message  = message;
                this.expected = expected;
                this.found    = found;
                this.location = location;
                this.name     = "SyntaxError";

                if (typeof Error.captureStackTrace === "function") {
                    Error.captureStackTrace(this, peg$SyntaxError);
                }
            }

            peg$subclass(peg$SyntaxError, Error);

            peg$SyntaxError.buildMessage = function(expected, found) {
                var DESCRIBE_EXPECTATION_FNS = {
                    literal: function(expectation) {
                        return "\"" + literalEscape(expectation.text) + "\"";
                    },

                    "class": function(expectation) {
                        var escapedParts = "",
                            i;

                        for (i = 0; i < expectation.parts.length; i++) {
                            escapedParts += expectation.parts[i] instanceof Array
                                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                                : classEscape(expectation.parts[i]);
                        }

                        return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                    },

                    any: function(expectation) {
                        return "any character";
                    },

                    end: function(expectation) {
                        return "end of input";
                    },

                    other: function(expectation) {
                        return expectation.description;
                    }
                };

                function hex(ch) {
                    return ch.charCodeAt(0).toString(16).toUpperCase();
                }

                function literalEscape(s) {
                    return s
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g,  '\\"')
                        .replace(/\0/g, '\\0')
                        .replace(/\t/g, '\\t')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
                        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
                }

                function classEscape(s) {
                    return s
                        .replace(/\\/g, '\\\\')
                        .replace(/\]/g, '\\]')
                        .replace(/\^/g, '\\^')
                        .replace(/-/g,  '\\-')
                        .replace(/\0/g, '\\0')
                        .replace(/\t/g, '\\t')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
                        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
                }

                function describeExpectation(expectation) {
                    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
                }

                function describeExpected(expected) {
                    var descriptions = new Array(expected.length),
                        i, j;

                    for (i = 0; i < expected.length; i++) {
                        descriptions[i] = describeExpectation(expected[i]);
                    }

                    descriptions.sort();

                    if (descriptions.length > 0) {
                        for (i = 1, j = 1; i < descriptions.length; i++) {
                            if (descriptions[i - 1] !== descriptions[i]) {
                                descriptions[j] = descriptions[i];
                                j++;
                            }
                        }
                        descriptions.length = j;
                    }

                    switch (descriptions.length) {
                        case 1:
                            return descriptions[0];

                        case 2:
                            return descriptions[0] + " or " + descriptions[1];

                        default:
                            return descriptions.slice(0, -1).join(", ")
                                + ", or "
                                + descriptions[descriptions.length - 1];
                    }
                }

                function describeFound(found) {
                    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
                }

                return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
            };

            function peg$parse(input, options) {
                options = options !== void 0 ? options : {};

                var peg$FAILED = {},

                    peg$startRuleFunctions = { start: peg$parsestart },
                    peg$startRuleFunction  = peg$parsestart,

                    peg$c0 = function() {  shaderType = "vs"; return true; },
                    peg$c1 = function(root) {
                        return root;
                    },
                    peg$c2 = function() {  shaderType = "fs"; return true; },
                    peg$c3 = /^[\n]/,
                    peg$c4 = peg$classExpectation(["\n"], false, false),
                    peg$c5 = function() {
                        return "\n";
                    },
                    peg$c6 = peg$anyExpectation(),
                    peg$c7 = peg$otherExpectation("whitespace"),
                    peg$c8 = /^[\\\n]/,
                    peg$c9 = peg$classExpectation(["\\", "\n"], false, false),
                    peg$c10 = /^[\r\t\f\x0B ]/,
                    peg$c11 = peg$classExpectation(["\r", "\t", "\f", "\x0B", " "], false, false),
                    peg$c12 = "/*",
                    peg$c13 = peg$literalExpectation("/*", false),
                    peg$c14 = "*/",
                    peg$c15 = peg$literalExpectation("*/", false),
                    peg$c16 = "//",
                    peg$c17 = peg$literalExpectation("//", false),
                    peg$c18 = /^[^\n]/,
                    peg$c19 = peg$classExpectation(["\n"], true, false),
                    peg$c20 = peg$otherExpectation("comment"),
                    peg$c21 = ";",
                    peg$c22 = peg$literalExpectation(";", false),
                    peg$c23 = ",",
                    peg$c24 = peg$literalExpectation(",", false),
                    peg$c25 = "[",
                    peg$c26 = peg$literalExpectation("[", false),
                    peg$c27 = "]",
                    peg$c28 = peg$literalExpectation("]", false),
                    peg$c29 = "=",
                    peg$c30 = peg$literalExpectation("=", false),
                    peg$c31 = "(",
                    peg$c32 = peg$literalExpectation("(", false),
                    peg$c33 = ")",
                    peg$c34 = peg$literalExpectation(")", false),
                    peg$c35 = "{",
                    peg$c36 = peg$literalExpectation("{", false),
                    peg$c37 = "}",
                    peg$c38 = peg$literalExpectation("}", false),
                    peg$c39 = function(statements) {
                        // Skip blank statements.  These were either whitespace or
                        var result = new node({ location: location(),
                            type: "root",
                            statements: []
                        });
                        for (var i = 0; i < statements.length; i++) {
                            if (statements[i]) {
                                result.statements = result.statements.concat(statements[i]);
                            }
                        }
                        return result;
                    },
                    peg$c40 = function(statement) { return statement; },
                    peg$c41 = function() { return ""; },
                    peg$c42 = "#",
                    peg$c43 = peg$literalExpectation("#", false),
                    peg$c44 = "undef",
                    peg$c45 = peg$literalExpectation("undef", false),
                    peg$c46 = "pragma",
                    peg$c47 = peg$literalExpectation("pragma", false),
                    peg$c48 = "version",
                    peg$c49 = peg$literalExpectation("version", false),
                    peg$c50 = "error",
                    peg$c51 = peg$literalExpectation("error", false),
                    peg$c52 = "extension",
                    peg$c53 = peg$literalExpectation("extension", false),
                    peg$c54 = "line",
                    peg$c55 = peg$literalExpectation("line", false),
                    peg$c56 = "include",
                    peg$c57 = peg$literalExpectation("include", false),
                    peg$c58 = function(directive, defname) {return defname.join("")},
                    peg$c59 = function(directive, value) {
                        return new node({ location: location(),
                            type: "preprocessor",
                            directive: "#" + directive,
                            value: value
                        });
                    },
                    peg$c60 = /^[A-Za-z_]/,
                    peg$c61 = peg$classExpectation([["A", "Z"], ["a", "z"], "_"], false, false),
                    peg$c62 = /^[A-Za-z_0-9]/,
                    peg$c63 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", ["0", "9"]], false, false),
                    peg$c64 = function(head, tail) {
                        return new node({ location: location(),
                            type: "identifier",
                            name: head + tail.join("")
                        });
                    },
                    peg$c65 = function(head, tail) {
                        if (!head) {
                            return [];
                        }
                        return [ head ].concat(tail.map(function(item) { return item[1]; }));
                    },
                    peg$c66 = /^[^()]/,
                    peg$c67 = peg$classExpectation(["(", ")"], true, false),
                    peg$c68 = function(head, paren, tail) {
                        return head.join("") + paren + tail.join("");
                    },
                    peg$c69 = function(value) {
                        return "(" + value + ")";
                    },
                    peg$c70 = /^[^,)]/,
                    peg$c71 = peg$classExpectation([",", ")"], true, false),
                    peg$c72 = function(value) {
                        return value.join("");
                    },
                    peg$c73 = function(head, tail) {
                        return [head].concat(tail.map(function(item) { return item[1]; }));
                    },
                    peg$c74 = function(macro_name, parameters) {
                        var result = new node({ location: location(),
                            type: "macro_call",
                            macro_name: macro_name,
                            parameters: parameters
                        });
                        if (!parameters) {
                            result.parameters = [];
                        }
                        return result;
                    },
                    peg$c75 = function(head, tail) {
                        return {
                            macro_call: head,
                            rest_of_line: tail.join('')
                        }
                    },
                    peg$c76 = "define",
                    peg$c77 = peg$literalExpectation("define", false),
                    peg$c78 = /^[ \t]/,
                    peg$c79 = peg$classExpectation([" ", "\t"], false, false),
                    peg$c80 = function(identifier, parameters, defname) {return defname.join("")},
                    peg$c81 = function(identifier, parameters, token_string) {
                        return new node({ location: location(),
                            type: "preprocessor",
                            directive: "#define",
                            identifier: identifier.name,
                            token_string: token_string,
                            parameters: parameters || null
                        });
                    },
                    peg$c82 = "ifdef",
                    peg$c83 = peg$literalExpectation("ifdef", false),
                    peg$c84 = "ifndef",
                    peg$c85 = peg$literalExpectation("ifndef", false),
                    peg$c86 = "if",
                    peg$c87 = peg$literalExpectation("if", false),
                    peg$c88 = function(directive, value) {
                        return new node({ location: location(),
                            type: "preprocessor",
                            directive: "#" + directive,
                            value: value
                        });
                    },
                    peg$c89 = "elif",
                    peg$c90 = peg$literalExpectation("elif", false),
                    peg$c91 = function(defname) {return defname.join("")},
                    peg$c92 = function(value) {
                        return new node({ location: location(),
                            type: "preprocessor",
                            directive: "#elif",
                            value: value
                        });
                    },
                    peg$c93 = "else",
                    peg$c94 = peg$literalExpectation("else", false),
                    peg$c95 = function() {
                        return new node({ location: location(),
                            type: "preprocessor",
                            directive: "#else"
                        });
                    },
                    peg$c96 = "endif",
                    peg$c97 = peg$literalExpectation("endif", false),
                    peg$c98 = function(if_directive, elif_directive, else_directive) {
                        return preprocessor_branch(if_directive, elif_directive, else_directive);
                    },
                    peg$c99 = function(prototype, body) {
                        var result = new node({ location: location(),
                            type: "function_declaration",
                            name: prototype.name,
                            returnType: prototype.returnType,
                            parameters: prototype.parameters,
                            body: body
                        });
                        return result;
                    },
                    peg$c100 = function(statements) {
                        var result = new node({ location: location(),
                            type: "scope",
                            statements: []
                        });
                        if (statements && statements.statements) {
                            result.statements = statements.statements;
                        }
                        return result;
                    },
                    peg$c101 = function(list) {return {statements: list};},
                    peg$c102 = function(statement) {
                        return statement;
                    },
                    peg$c103 = function(condition, if_body, else_body) {
                        var result = new node({ location: location(),
                            type:"if_statement",
                            condition:condition,
                            body:if_body
                        });
                        if (else_body) {
                            result.elseBody = else_body[2];
                        }
                        return result;
                    },
                    peg$c104 = "for",
                    peg$c105 = peg$literalExpectation("for", false),
                    peg$c106 = function(initializer, condition, increment, body) {
                        return new node({ location: location(),
                            type:"for_statement",
                            initializer:initializer,
                            condition:condition,
                            increment:increment,
                            body:body
                        });
                    },
                    peg$c107 = "while",
                    peg$c108 = peg$literalExpectation("while", false),
                    peg$c109 = function(condition) {
                        return {
                            condition:condition
                        };
                    },
                    peg$c110 = function(w, body) {
                        return new node({ location: location(),
                            type: "while_statement",
                            condition: w.condition,
                            body: body
                        });
                    },
                    peg$c111 = "do",
                    peg$c112 = peg$literalExpectation("do", false),
                    peg$c113 = function(body, w) {
                        return new node({ location: location(),
                            type: "do_statement",
                            condition: w.condition,
                            body: body
                        });
                    },
                    peg$c114 = "return",
                    peg$c115 = peg$literalExpectation("return", false),
                    peg$c116 = "++",
                    peg$c117 = peg$literalExpectation("++", false),
                    peg$c118 = "--",
                    peg$c119 = peg$literalExpectation("--", false),
                    peg$c120 = "!",
                    peg$c121 = peg$literalExpectation("!", false),
                    peg$c122 = "~",
                    peg$c123 = peg$literalExpectation("~", false),
                    peg$c124 = "+",
                    peg$c125 = peg$literalExpectation("+", false),
                    peg$c126 = "-",
                    peg$c127 = peg$literalExpectation("-", false),
                    peg$c128 = function(head, expression) {
                        return new node({ location: location(),
                            type: "return",
                            value: expression
                        });
                    },
                    peg$c129 = "continue",
                    peg$c130 = peg$literalExpectation("continue", false),
                    peg$c131 = "break",
                    peg$c132 = peg$literalExpectation("break", false),
                    peg$c133 = function(type) {
                        return new node({ location: location(),
                            type:type[0]
                        });
                    },
                    peg$c134 = function(e) {
                        return new node({ location: location(),
                            type: "expression",
                            expression: e
                        });
                    },
                    peg$c135 = function(head, tail) {
                        return new node({ location: location(),
                            type: "sequence",
                            expressions: [ head ].concat(tail.map(function(item) { return item[1] }))
                        })
                    },
                    peg$c136 = peg$otherExpectation("declaration"),
                    peg$c137 = function(function_prototype) {
                        return function_prototype;
                    },
                    peg$c138 = function(type, declarators) {
                        return new node({ location: location(),
                            type: "declarator",
                            typeAttribute: type,
                            declarators: declarators
                        });
                    },
                    peg$c139 = function(type, declarators) {
                        return new node({ location: location(),
                            type: "declarator",
                            typeAttribute: type,
                            declarators: declarators
                        });
                    },
                    peg$c140 = "void",
                    peg$c141 = peg$literalExpectation("void", false),
                    peg$c142 = function(head, tail) {
                        return [ head ].concat(tail.map(function(item) { return item[1]; }));
                    },
                    peg$c143 = function(type, identifier, parameters) {
                        var result = new node({ location: location(),
                            type:"function_prototype",
                            name: identifier.name,
                            returnType: type,
                            parameters: parameters
                        });
                        if (parameters == "void" || !parameters) {
                            result.parameters = [];
                        }
                        return result;
                    },
                    peg$c144 = "",
                    peg$c145 = function(const_qualifier, parameter, precision, type_name, identifier, array_size) {
                        var result = new node({ location: location(),
                            type: "parameter",
                            type_name: type_name,
                            name: identifier.name
                        });
                        if (const_qualifier) result.typeQualifier = const_qualifier[0];
                        if (parameter) result.parameterQualifier = parameter[0];
                        if (precision) result.precision = precision[0];
                        if (array_size) result.arraySize = array_size[1];
                        // "const" is only legal on "in" parameter qualifiers.
                        if (result.typeQualifier &&
                            result.parameterQualifier &&
                            result.parameterQualifier != "in") {
                            return null;
                        } else {
                            return result;
                        }
                    },
                    peg$c146 = function(head, tail) {
                        return [ head ].concat(tail.map(function(item) { return item[1]; }));
                    },
                    peg$c147 = function(name) {
                        return new node({ location: location(),
                            type: "declarator_item",
                            name:name
                        });
                    },
                    peg$c148 = function(name, arraySize, list) {
                        let newNode = new node({ location: location(),
                            type: "declarator_item",
                            name: name,
                            arraySize: arraySize,
                            isArray: true
                        })

                        if (list && list[2])
                        {
                            newNode.initializer_list = list[2];
                        }

                        return newNode;
                    },
                    peg$c149 = function(head, tail) {
                        return [ head ].concat(tail.map(function(item) { return item[1] }));
                    },
                    peg$c150 = function(name, initList) {
                        return new node({ location: location(),
                            type: "declarator_item",
                            name: name,
                            isArray: true,
                            arraySize: {
                                type: "int",
                                format: "number",
                                value_base10: initList.length,
                                value: initList.length
                            },
                            initializer_list: initList
                        });
                    },
                    peg$c151 = function(name, initializer) {
                        return new node({ location: location(),
                            type: "declarator_item",
                            name: name,
                            initializer:initializer
                        });
                    },
                    peg$c152 = function(declarators) {
                        return declarators.map(function(item) {
                            return new node({ location: location(),
                                type: "declarator",
                                typeAttribute: item[0],
                                declarators: item[2]
                            })
                        });
                    },
                    peg$c153 = "struct",
                    peg$c154 = peg$literalExpectation("struct", false),
                    peg$c155 = function(qualifier, identifier, members) {
                        var result = new node({ location: location(),
                            type: "struct_definition",
                            members:members
                        });
                        if (qualifier) {
                            result.qualifier = qualifier[0];
                        }
                        if (identifier) {
                            result.name = identifier[1].name;
                            typeNames[result.name] = result;
                        }
                        return result;
                    },
                    peg$c156 = function(precision, name) {
                        var result = new node({ location: location(),
                            type: "type",
                            name: name
                        });
                        if (precision) result.precision = precision[0];
                        return result;
                    },
                    peg$c157 = peg$otherExpectation("locally specified type"),
                    peg$c158 = function(qualifier, type) {
                        var result = type;
                        if (qualifier) result.qualifier = qualifier[0];
                        return result;
                    },
                    peg$c159 = function() { return shaderType == "vs"; },
                    peg$c160 = "attribute",
                    peg$c161 = peg$literalExpectation("attribute", false),
                    peg$c162 = function() {
                        return "attribute";
                    },
                    peg$c163 = function(qualifier, type) {
                        var result = type;
                        result.qualifier = qualifier;
                        return result;
                    },
                    peg$c164 = peg$otherExpectation("fully specified type"),
                    peg$c165 = peg$otherExpectation("precision qualifier"),
                    peg$c166 = "highp",
                    peg$c167 = peg$literalExpectation("highp", false),
                    peg$c168 = "mediump",
                    peg$c169 = peg$literalExpectation("mediump", false),
                    peg$c170 = "lowp",
                    peg$c171 = peg$literalExpectation("lowp", false),
                    peg$c172 = "const",
                    peg$c173 = peg$literalExpectation("const", false),
                    peg$c174 = peg$otherExpectation("type qualifier"),
                    peg$c175 = "varying",
                    peg$c176 = peg$literalExpectation("varying", false),
                    peg$c177 = "invariant",
                    peg$c178 = peg$literalExpectation("invariant", false),
                    peg$c179 = function() { return "invariant varying"; },
                    peg$c180 = "uniform",
                    peg$c181 = peg$literalExpectation("uniform", false),
                    peg$c182 = peg$otherExpectation("void"),
                    peg$c183 = function() {
                        return new node({ location: location(),
                            type: "type",
                            name: "void"
                        })
                    },
                    peg$c184 = "float",
                    peg$c185 = peg$literalExpectation("float", false),
                    peg$c186 = "int",
                    peg$c187 = peg$literalExpectation("int", false),
                    peg$c188 = "uint",
                    peg$c189 = peg$literalExpectation("uint", false),
                    peg$c190 = peg$otherExpectation("type name"),
                    peg$c191 = function(name) {
                        return name.name;
                    },
                    peg$c192 = peg$otherExpectation("identifier"),
                    peg$c193 = /^[^A-Za-z_0-9]/,
                    peg$c194 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", ["0", "9"]], true, false),
                    peg$c195 = /^[$A-Za-z_]/,
                    peg$c196 = peg$classExpectation(["$", ["A", "Z"], ["a", "z"], "_"], false, false),
                    peg$c197 = /^[$A-Za-z_0-9]/,
                    peg$c198 = peg$classExpectation(["$", ["A", "Z"], ["a", "z"], "_", ["0", "9"]], false, false),
                    peg$c199 = peg$otherExpectation("keyword"),
                    peg$c200 = "double",
                    peg$c201 = peg$literalExpectation("double", false),
                    peg$c202 = "true",
                    peg$c203 = peg$literalExpectation("true", false),
                    peg$c204 = "false",
                    peg$c205 = peg$literalExpectation("false", false),
                    peg$c206 = /^[biud]/,
                    peg$c207 = peg$classExpectation(["b", "i", "u", "d"], false, false),
                    peg$c208 = "vec",
                    peg$c209 = peg$literalExpectation("vec", false),
                    peg$c210 = /^[234]/,
                    peg$c211 = peg$classExpectation(["2", "3", "4"], false, false),
                    peg$c212 = function(a) { return a.join(""); },
                    peg$c213 = /^[d]/,
                    peg$c214 = peg$classExpectation(["d"], false, false),
                    peg$c215 = "mat",
                    peg$c216 = peg$literalExpectation("mat", false),
                    peg$c217 = /^[x]/,
                    peg$c218 = peg$classExpectation(["x"], false, false),
                    peg$c219 = /^[iu]/,
                    peg$c220 = peg$classExpectation(["i", "u"], false, false),
                    peg$c221 = "sampler",
                    peg$c222 = peg$literalExpectation("sampler", false),
                    peg$c223 = /^[123]/,
                    peg$c224 = peg$classExpectation(["1", "2", "3"], false, false),
                    peg$c225 = "D",
                    peg$c226 = peg$literalExpectation("D", false),
                    peg$c227 = "Array",
                    peg$c228 = peg$literalExpectation("Array", false),
                    peg$c229 = "Shadow",
                    peg$c230 = peg$literalExpectation("Shadow", false),
                    peg$c231 = "samplerCube",
                    peg$c232 = peg$literalExpectation("samplerCube", false),
                    peg$c233 = "sampler2DRect",
                    peg$c234 = peg$literalExpectation("sampler2DRect", false),
                    peg$c235 = "sampler2DMS",
                    peg$c236 = peg$literalExpectation("sampler2DMS", false),
                    peg$c237 = "samplerBuffer",
                    peg$c238 = peg$literalExpectation("samplerBuffer", false),
                    peg$c239 = peg$otherExpectation("reserved name"),
                    peg$c240 = "__",
                    peg$c241 = peg$literalExpectation("__", false),
                    peg$c242 = /^[A-Za-z0-9]/,
                    peg$c243 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"]], false, false),
                    peg$c244 = "_",
                    peg$c245 = peg$literalExpectation("_", false),
                    peg$c246 = /^[\-1-9]/,
                    peg$c247 = peg$classExpectation(["-", ["1", "9"]], false, false),
                    peg$c248 = /^[0-9]/,
                    peg$c249 = peg$classExpectation([["0", "9"]], false, false),
                    peg$c250 = /^[Uu]/,
                    peg$c251 = peg$classExpectation(["U", "u"], false, false),
                    peg$c252 = function(head, tail, unsigned) {
                        return new node({ location: location(),
                            type: "int",
                            format: "number",
                            value_base10: parseInt([head].concat(tail).join(""), 10),
                            value: [head].concat(tail).join("") + (unsigned ? unsigned : '')
                        });
                    },
                    peg$c253 = "0",
                    peg$c254 = peg$literalExpectation("0", false),
                    peg$c255 = /^[Xx]/,
                    peg$c256 = peg$classExpectation(["X", "x"], false, false),
                    peg$c257 = /^[0-9A-Fa-f]/,
                    peg$c258 = peg$classExpectation([["0", "9"], ["A", "F"], ["a", "f"]], false, false),
                    peg$c259 = function(digits, unsigned) {
                        return new node({ location: location(),
                            type: "int",
                            format: "hex",
                            value_base10: parseInt(digits.join(""), 16),
                            value: "0x" + digits.join("") + (unsigned ? unsigned : '')
                        });
                    },
                    peg$c260 = /^[0-7]/,
                    peg$c261 = peg$classExpectation([["0", "7"]], false, false),
                    peg$c262 = function(digits, unsigned) {
                        return new node({ location: location(),
                            type: "int",
                            format: "octal",
                            value_base10: parseInt(digits.join(""), 8),
                            value: "0" + digits.join("") + (unsigned ? unsigned : '')
                        });
                    },
                    peg$c263 = function(unsigned) {
                        return new node({ location: location(),
                            type: "int",
                            format: "number",
                            value_base10: 0,
                            value: "0" + (unsigned ? unsigned : '')
                        });
                    },
                    peg$c264 = /^[\-0-9]/,
                    peg$c265 = peg$classExpectation(["-", ["0", "9"]], false, false),
                    peg$c266 = ".",
                    peg$c267 = peg$literalExpectation(".", false),
                    peg$c268 = /^[fF]/,
                    peg$c269 = peg$classExpectation(["f", "F"], false, false),
                    peg$c270 = "lf",
                    peg$c271 = peg$literalExpectation("lf", false),
                    peg$c272 = "LF",
                    peg$c273 = peg$literalExpectation("LF", false),
                    peg$c274 = function(digits, suffix) {
                        digits[0] = digits[0].join("");
                        digits[2] = digits[2].join("");
                        return new node({ location: location(),
                            type: "float",
                            value_base10: parseFloat(digits.join("")),
                            value: digits.join("") + (suffix ? suffix : '')
                        });
                    },
                    peg$c275 = /^[f]/,
                    peg$c276 = peg$classExpectation(["f"], false, false),
                    peg$c277 = function(digits, suffix) {
                        return new node({ location: location(),
                            type: "float",
                            value_base10: parseFloat(digits[0].join("") + digits[1]),
                            value: digits.join("") + (suffix ? suffix : '')
                        });
                    },
                    peg$c278 = /^[Ee]/,
                    peg$c279 = peg$classExpectation(["E", "e"], false, false),
                    peg$c280 = /^[+\-]/,
                    peg$c281 = peg$classExpectation(["+", "-"], false, false),
                    peg$c282 = function(sign, exponent) {
                        return ["e", sign].concat(exponent).join("");
                    },
                    peg$c283 = function(expression) {
                        return expression;
                    },
                    peg$c284 = function(value) {
                        return new node({ location: location(),
                            type: "int",
                            format: "number",
                            value: value == "true" ? "1" : "0",
                            value_base10: value == "true" ? 1 : 0
                        });
                    },
                    peg$c285 = function(t, exp) {
                        return new node({ location: location(),
                            type: "type_cast",
                            cast_to: t,
                            expression: exp
                        });
                    },
                    peg$c286 = function(t, exp) {
                        return new node({ location: location(),
                            type: "type_cast",
                            cast_to: t,
                            expression: exp
                        });
                    },
                    peg$c287 = function(index) {
                        return new node({ location: location(),
                            type: "accessor",
                            index: index
                        });
                    },
                    peg$c288 = function(id) {
                        return new node({ location: location(),
                            type: "field_selector",
                            selection: id.name
                        })
                    },
                    peg$c289 = function(head, tail) {
                        var result = head;
                        for (var i = 0; i < tail.length; i++) {
                            result = new node({ location: location(),
                                type: "postfix",
                                operator: tail[i],
                                expression: result
                            })
                        }
                        return result;
                    },
                    peg$c290 = function(head, tail, rest) {
                        var result = head;
                        if(tail) {
                            result = new node({ location: location(),
                                type: "postfix",
                                operator: new node({ location: location(),
                                    id: next_id++,
                                    type: "operator",
                                    operator: tail
                                }),
                                expression: result
                            })
                        }
                        for (var i = 0; i < rest.length; i++) {
                            result = new node({ location: location(),
                                type: "postfix",
                                operator: rest[i],
                                expression: result
                            })
                        }
                        return result;
                    },
                    peg$c291 = function() {return []; },
                    peg$c292 = function(function_name, parameters) {
                        var result = new node({ location: location(),
                            type: "function_call",
                            function_name: function_name,
                            parameters: parameters
                        });
                        if (!parameters) {
                            result.parameters = [];
                        }
                        return result;
                    },
                    peg$c293 = function(id) {return id.name;},
                    peg$c294 = function(head, tail) {
                        var result = tail
                        if (head) {
                            result = new node({ location: location(),
                                type: "unary",
                                expression: result,
                                operator: new node({ location: location(),
                                    type: "operator",
                                    operator: head
                                })
                            });
                        }
                        return result;
                    },
                    peg$c295 = "*",
                    peg$c296 = peg$literalExpectation("*", false),
                    peg$c297 = "/",
                    peg$c298 = peg$literalExpectation("/", false),
                    peg$c299 = "%",
                    peg$c300 = peg$literalExpectation("%", false),
                    peg$c301 = function(operator) {
                        return new node({ location: location(),
                            type: "operator",
                            operator: operator
                        });
                    },
                    peg$c302 = function(head, tail) {
                        return daisy_chain(head, tail);
                    },
                    peg$c303 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "+"
                        });
                    },
                    peg$c304 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "-"
                        });
                    },
                    peg$c305 = "<<",
                    peg$c306 = peg$literalExpectation("<<", false),
                    peg$c307 = ">>",
                    peg$c308 = peg$literalExpectation(">>", false),
                    peg$c309 = "<",
                    peg$c310 = peg$literalExpectation("<", false),
                    peg$c311 = function(equal) {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "<" + (equal ? equal : '')
                        });
                    },
                    peg$c312 = ">",
                    peg$c313 = peg$literalExpectation(">", false),
                    peg$c314 = function(equal) {
                        return new node({ location: location(),
                            type: "operator",
                            operator: ">" + (equal ? equal : '')
                        });
                    },
                    peg$c315 = "==",
                    peg$c316 = peg$literalExpectation("==", false),
                    peg$c317 = "!=",
                    peg$c318 = peg$literalExpectation("!=", false),
                    peg$c319 = function(operator) {
                        return new node({ location: location(),
                            type: "operator",
                            operator: operator
                        });
                    },
                    peg$c320 = "&",
                    peg$c321 = peg$literalExpectation("&", false),
                    peg$c322 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "&"
                        });
                    },
                    peg$c323 = "^",
                    peg$c324 = peg$literalExpectation("^", false),
                    peg$c325 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "^"
                        });
                    },
                    peg$c326 = "|",
                    peg$c327 = peg$literalExpectation("|", false),
                    peg$c328 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "|"
                        });
                    },
                    peg$c329 = "&&",
                    peg$c330 = peg$literalExpectation("&&", false),
                    peg$c331 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "&&"
                        });
                    },
                    peg$c332 = "^^",
                    peg$c333 = peg$literalExpectation("^^", false),
                    peg$c334 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "^^"
                        });
                    },
                    peg$c335 = "||",
                    peg$c336 = peg$literalExpectation("||", false),
                    peg$c337 = function() {
                        return new node({ location: location(),
                            type: "operator",
                            operator: "||"
                        });
                    },
                    peg$c338 = "?",
                    peg$c339 = peg$literalExpectation("?", false),
                    peg$c340 = ":",
                    peg$c341 = peg$literalExpectation(":", false),
                    peg$c342 = function(head, tail) {
                        var result = head;
                        if (tail) {
                            result = new node({ location: location(),
                                type: "ternary",
                                condition: head,
                                is_true: tail[3],
                                is_false: tail[7]
                            })
                        }
                        return result;
                    },
                    peg$c343 = "*=",
                    peg$c344 = peg$literalExpectation("*=", false),
                    peg$c345 = "/=",
                    peg$c346 = peg$literalExpectation("/=", false),
                    peg$c347 = "%=",
                    peg$c348 = peg$literalExpectation("%=", false),
                    peg$c349 = "+=",
                    peg$c350 = peg$literalExpectation("+=", false),
                    peg$c351 = "-=",
                    peg$c352 = peg$literalExpectation("-=", false),
                    peg$c353 = "<<=",
                    peg$c354 = peg$literalExpectation("<<=", false),
                    peg$c355 = ">>=",
                    peg$c356 = peg$literalExpectation(">>=", false),
                    peg$c357 = "&=",
                    peg$c358 = peg$literalExpectation("&=", false),
                    peg$c359 = "^=",
                    peg$c360 = peg$literalExpectation("^=", false),
                    peg$c361 = "|=",
                    peg$c362 = peg$literalExpectation("|=", false),
                    peg$c363 = function(variable, operator, expression) {
                        return new node({ location: location(),
                            type: "binary",
                            operator: new node({ location: location(),
                                type: "operator",
                                operator: operator
                            }),
                            left: variable,
                            right: expression
                        });
                    },

                    peg$currPos          = 0,
                    peg$savedPos         = 0,
                    peg$posDetailsCache  = [{ line: 1, column: 1 }],
                    peg$maxFailPos       = 0,
                    peg$maxFailExpected  = [],
                    peg$silentFails      = 0,

                    peg$result;

                if ("startRule" in options) {
                    if (!(options.startRule in peg$startRuleFunctions)) {
                        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
                    }

                    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
                }

                function text() {
                    return input.substring(peg$savedPos, peg$currPos);
                }

                function location() {
                    return peg$computeLocation(peg$savedPos, peg$currPos);
                }

                function expected(description, location) {
                    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

                    throw peg$buildStructuredError(
                        [peg$otherExpectation(description)],
                        input.substring(peg$savedPos, peg$currPos),
                        location
                    );
                }

                function error(message, location) {
                    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

                    throw peg$buildSimpleError(message, location);
                }

                function peg$literalExpectation(text, ignoreCase) {
                    return { type: "literal", text: text, ignoreCase: ignoreCase };
                }

                function peg$classExpectation(parts, inverted, ignoreCase) {
                    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
                }

                function peg$anyExpectation() {
                    return { type: "any" };
                }

                function peg$endExpectation() {
                    return { type: "end" };
                }

                function peg$otherExpectation(description) {
                    return { type: "other", description: description };
                }

                function peg$computePosDetails(pos) {
                    var details = peg$posDetailsCache[pos], p;

                    if (details) {
                        return details;
                    } else {
                        p = pos - 1;
                        while (!peg$posDetailsCache[p]) {
                            p--;
                        }

                        details = peg$posDetailsCache[p];
                        details = {
                            line:   details.line,
                            column: details.column
                        };

                        while (p < pos) {
                            if (input.charCodeAt(p) === 10) {
                                details.line++;
                                details.column = 1;
                            } else {
                                details.column++;
                            }

                            p++;
                        }

                        peg$posDetailsCache[pos] = details;
                        return details;
                    }
                }

                function peg$computeLocation(startPos, endPos) {
                    var startPosDetails = peg$computePosDetails(startPos),
                        endPosDetails   = peg$computePosDetails(endPos);

                    return {
                        start: {
                            offset: startPos,
                            line:   startPosDetails.line,
                            column: startPosDetails.column
                        },
                        end: {
                            offset: endPos,
                            line:   endPosDetails.line,
                            column: endPosDetails.column
                        }
                    };
                }

                function peg$fail(expected) {
                    if (peg$currPos < peg$maxFailPos) { return; }

                    if (peg$currPos > peg$maxFailPos) {
                        peg$maxFailPos = peg$currPos;
                        peg$maxFailExpected = [];
                    }

                    peg$maxFailExpected.push(expected);
                }

                function peg$buildSimpleError(message, location) {
                    return new peg$SyntaxError(message, null, null, location);
                }

                function peg$buildStructuredError(expected, found, location) {
                    return new peg$SyntaxError(
                        peg$SyntaxError.buildMessage(expected, found),
                        expected,
                        found,
                        location
                    );
                }

                function peg$parsestart() {
                    var s0;

                    s0 = peg$parseexternal_statement_list();

                    return s0;
                }

                function peg$parsevertex_start() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    peg$savedPos = peg$currPos;
                    s1 = peg$c0();
                    if (s1) {
                        s1 = void 0;
                    } else {
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseexternal_statement_list();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c1(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsefragment_start() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    peg$savedPos = peg$currPos;
                    s1 = peg$c2();
                    if (s1) {
                        s1 = void 0;
                    } else {
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseexternal_statement_list();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c1(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsenewLine() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (peg$c3.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c4); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c5();
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parseEOF() {
                    var s0, s1;

                    s0 = peg$currPos;
                    peg$silentFails++;
                    if (input.length > peg$currPos) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    peg$silentFails--;
                    if (s1 === peg$FAILED) {
                        s0 = void 0;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parse_() {
                    var s0, s1;

                    peg$silentFails++;
                    s0 = [];
                    s1 = peg$parsenewLine();
                    if (s1 === peg$FAILED) {
                        if (peg$c8.test(input.charAt(peg$currPos))) {
                            s1 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c9); }
                        }
                        if (s1 === peg$FAILED) {
                            if (peg$c10.test(input.charAt(peg$currPos))) {
                                s1 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c11); }
                            }
                            if (s1 === peg$FAILED) {
                                s1 = peg$parsecomment();
                            }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        while (s1 !== peg$FAILED) {
                            s0.push(s1);
                            s1 = peg$parsenewLine();
                            if (s1 === peg$FAILED) {
                                if (peg$c8.test(input.charAt(peg$currPos))) {
                                    s1 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c9); }
                                }
                                if (s1 === peg$FAILED) {
                                    if (peg$c10.test(input.charAt(peg$currPos))) {
                                        s1 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c11); }
                                    }
                                    if (s1 === peg$FAILED) {
                                        s1 = peg$parsecomment();
                                    }
                                }
                            }
                        }
                    } else {
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c7); }
                    }

                    return s0;
                }

                function peg$parsenoNewlineComment() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c12) {
                        s1 = peg$c12;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c13); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 2) === peg$c14) {
                            s5 = peg$c14;
                            peg$currPos += 2;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c15); }
                        }
                        peg$silentFails--;
                        if (s5 === peg$FAILED) {
                            s4 = void 0;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 !== peg$FAILED) {
                            if (input.length > peg$currPos) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c6); }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$currPos;
                            peg$silentFails++;
                            if (input.substr(peg$currPos, 2) === peg$c14) {
                                s5 = peg$c14;
                                peg$currPos += 2;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c15); }
                            }
                            peg$silentFails--;
                            if (s5 === peg$FAILED) {
                                s4 = void 0;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            if (s4 !== peg$FAILED) {
                                if (input.length > peg$currPos) {
                                    s5 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c6); }
                                }
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c14) {
                                s3 = peg$c14;
                                peg$currPos += 2;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c15); }
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c16) {
                            s1 = peg$c16;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c17); }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            if (peg$c18.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c19); }
                            }
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                if (peg$c18.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                s1 = [s1, s2];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parsenoNewlineWhitespace() {
                    var s0, s1;

                    s0 = [];
                    if (peg$c10.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c11); }
                    }
                    if (s1 === peg$FAILED) {
                        s1 = peg$parsenoNewlineComment();
                    }
                    if (s1 !== peg$FAILED) {
                        while (s1 !== peg$FAILED) {
                            s0.push(s1);
                            if (peg$c10.test(input.charAt(peg$currPos))) {
                                s1 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c11); }
                            }
                            if (s1 === peg$FAILED) {
                                s1 = peg$parsenoNewlineComment();
                            }
                        }
                    } else {
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsecomment() {
                    var s0, s1, s2, s3, s4, s5;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c12) {
                        s1 = peg$c12;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c13); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 2) === peg$c14) {
                            s5 = peg$c14;
                            peg$currPos += 2;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c15); }
                        }
                        peg$silentFails--;
                        if (s5 === peg$FAILED) {
                            s4 = void 0;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 !== peg$FAILED) {
                            if (input.length > peg$currPos) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c6); }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$currPos;
                            peg$silentFails++;
                            if (input.substr(peg$currPos, 2) === peg$c14) {
                                s5 = peg$c14;
                                peg$currPos += 2;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c15); }
                            }
                            peg$silentFails--;
                            if (s5 === peg$FAILED) {
                                s4 = void 0;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            if (s4 !== peg$FAILED) {
                                if (input.length > peg$currPos) {
                                    s5 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c6); }
                                }
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c14) {
                                s3 = peg$c14;
                                peg$currPos += 2;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c15); }
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c16) {
                            s1 = peg$c16;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c17); }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            if (peg$c18.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c19); }
                            }
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                if (peg$c18.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parsenewLine();
                                if (s3 === peg$FAILED) {
                                    s3 = peg$parseEOF();
                                }
                                if (s3 !== peg$FAILED) {
                                    s1 = [s1, s2, s3];
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c20); }
                    }

                    return s0;
                }

                function peg$parsesemicolon() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 59) {
                            s2 = peg$c21;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c22); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsecomma() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s2 = peg$c23;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c24); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseleft_bracket() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 91) {
                            s2 = peg$c25;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c26); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseright_bracket() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 93) {
                            s2 = peg$c27;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c28); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseequals() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s2 = peg$c29;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseleft_paren() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 40) {
                            s2 = peg$c31;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c32); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseright_paren() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s2 = peg$c33;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c34); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseleft_brace() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 123) {
                            s2 = peg$c35;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c36); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseright_brace() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 125) {
                            s2 = peg$c37;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c38); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseexternal_statement_list() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    s1 = [];
                    s2 = peg$parseexternal_statement();
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parseexternal_statement();
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c39(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parseexternal_statement() {
                    var s0, s1;

                    s0 = peg$currPos;
                    s1 = peg$parseexternal_declaration();
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c40(s1);
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parse_();
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c41();
                        }
                        s0 = s1;
                    }

                    return s0;
                }

                function peg$parseexternal_declaration() {
                    var s0;

                    s0 = peg$parsefunction_definition();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseglobal_declaration();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsestruct_definition();
                        }
                    }

                    return s0;
                }

                function peg$parsepreprocessor_operator() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c44) {
                            s2 = peg$c44;
                            peg$currPos += 5;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c45); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c46) {
                                s2 = peg$c46;
                                peg$currPos += 6;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c47); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 7) === peg$c48) {
                                    s2 = peg$c48;
                                    peg$currPos += 7;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c49); }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c50) {
                                        s2 = peg$c50;
                                        peg$currPos += 5;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c51); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 9) === peg$c52) {
                                            s2 = peg$c52;
                                            peg$currPos += 9;
                                        } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c53); }
                                        }
                                        if (s2 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 4) === peg$c54) {
                                                s2 = peg$c54;
                                                peg$currPos += 4;
                                            } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c55); }
                                            }
                                            if (s2 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 7) === peg$c56) {
                                                    s2 = peg$c56;
                                                    peg$currPos += 7;
                                                } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c57); }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$currPos;
                                s5 = [];
                                if (peg$c18.test(input.charAt(peg$currPos))) {
                                    s6 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                }
                                while (s6 !== peg$FAILED) {
                                    s5.push(s6);
                                    if (peg$c18.test(input.charAt(peg$currPos))) {
                                        s6 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s4;
                                    s5 = peg$c58(s2, s5);
                                }
                                s4 = s5;
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsenewLine();
                                    if (s5 === peg$FAILED) {
                                        s5 = peg$parseEOF();
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c59(s2, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemacro_identifier() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (peg$c60.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c61); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        if (peg$c62.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c63); }
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c62.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c63); }
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c64(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_parameter_list() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s1 = peg$c31;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c32); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsemacro_identifier();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            s4 = peg$currPos;
                            s5 = peg$parsecomma();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parsemacro_identifier();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                s4 = peg$currPos;
                                s5 = peg$parsecomma();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parsemacro_identifier();
                                    if (s6 !== peg$FAILED) {
                                        s5 = [s5, s6];
                                        s4 = s5;
                                    } else {
                                        peg$currPos = s4;
                                        s4 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseright_paren();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c65(s2, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemacro_paren_parameter() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    s1 = peg$parseleft_paren();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        s3 = [];
                        if (peg$c66.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c67); }
                        }
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            if (peg$c66.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c67); }
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parsemacro_paren_parameter();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = [];
                                if (peg$c66.test(input.charAt(peg$currPos))) {
                                    s6 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c67); }
                                }
                                while (s6 !== peg$FAILED) {
                                    s5.push(s6);
                                    if (peg$c66.test(input.charAt(peg$currPos))) {
                                        s6 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c67); }
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s2;
                                    s3 = peg$c68(s3, s4, s5);
                                    s2 = s3;
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_paren();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c69(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemacro_call_parameter() {
                    var s0, s1, s2;

                    s0 = peg$parsemacro_paren_parameter();
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = [];
                        if (peg$c70.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c71); }
                        }
                        while (s2 !== peg$FAILED) {
                            s1.push(s2);
                            if (peg$c70.test(input.charAt(peg$currPos))) {
                                s2 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c71); }
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c72(s1);
                        }
                        s0 = s1;
                    }

                    return s0;
                }

                function peg$parsemacro_call_parameter_list() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsemacro_call_parameter();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsemacro_call_parameter();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsemacro_call_parameter();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c73(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemacro_call() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsemacro_identifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseleft_paren();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseparameter_list();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                        s5 = peg$c33;
                                        peg$currPos++;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c34); }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c74(s1, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemacro_call_line() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parsemacro_call();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        if (peg$c18.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c19); }
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c18.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c19); }
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c75(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_define() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c76) {
                                s3 = peg$c76;
                                peg$currPos += 6;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c77); }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsemacro_identifier();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parsepreprocessor_parameter_list();
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            s7 = [];
                                            if (peg$c78.test(input.charAt(peg$currPos))) {
                                                s8 = input.charAt(peg$currPos);
                                                peg$currPos++;
                                            } else {
                                                s8 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c79); }
                                            }
                                            while (s8 !== peg$FAILED) {
                                                s7.push(s8);
                                                if (peg$c78.test(input.charAt(peg$currPos))) {
                                                    s8 = input.charAt(peg$currPos);
                                                    peg$currPos++;
                                                } else {
                                                    s8 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c79); }
                                                }
                                            }
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$currPos;
                                                s9 = [];
                                                if (peg$c18.test(input.charAt(peg$currPos))) {
                                                    s10 = input.charAt(peg$currPos);
                                                    peg$currPos++;
                                                } else {
                                                    s10 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                                }
                                                while (s10 !== peg$FAILED) {
                                                    s9.push(s10);
                                                    if (peg$c18.test(input.charAt(peg$currPos))) {
                                                        s10 = input.charAt(peg$currPos);
                                                        peg$currPos++;
                                                    } else {
                                                        s10 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                                    }
                                                }
                                                if (s9 !== peg$FAILED) {
                                                    peg$savedPos = s8;
                                                    s9 = peg$c80(s5, s6, s9);
                                                }
                                                s8 = s9;
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parsenewLine();
                                                    if (s9 === peg$FAILED) {
                                                        s9 = peg$parseEOF();
                                                    }
                                                    if (s9 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c81(s5, s6, s8);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_if() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c82) {
                                s3 = peg$c82;
                                peg$currPos += 5;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c83); }
                            }
                            if (s3 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c84) {
                                    s3 = peg$c84;
                                    peg$currPos += 6;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c85); }
                                }
                                if (s3 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c86) {
                                        s3 = peg$c86;
                                        peg$currPos += 2;
                                    } else {
                                        s3 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c87); }
                                    }
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$currPos;
                                    s6 = [];
                                    if (peg$c18.test(input.charAt(peg$currPos))) {
                                        s7 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                    }
                                    while (s7 !== peg$FAILED) {
                                        s6.push(s7);
                                        if (peg$c18.test(input.charAt(peg$currPos))) {
                                            s7 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                        }
                                    }
                                    if (s6 !== peg$FAILED) {
                                        peg$savedPos = s5;
                                        s6 = peg$c58(s3, s6);
                                    }
                                    s5 = s6;
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parsenewLine();
                                        if (s6 === peg$FAILED) {
                                            s6 = peg$parseEOF();
                                        }
                                        if (s6 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c88(s3, s5);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_else_if() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c89) {
                                s3 = peg$c89;
                                peg$currPos += 4;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c90); }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$currPos;
                                    s6 = [];
                                    if (peg$c18.test(input.charAt(peg$currPos))) {
                                        s7 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                    }
                                    while (s7 !== peg$FAILED) {
                                        s6.push(s7);
                                        if (peg$c18.test(input.charAt(peg$currPos))) {
                                            s7 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                        }
                                    }
                                    if (s6 !== peg$FAILED) {
                                        peg$savedPos = s5;
                                        s6 = peg$c91(s6);
                                    }
                                    s5 = s6;
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parsenewLine();
                                        if (s6 === peg$FAILED) {
                                            s6 = peg$parseEOF();
                                        }
                                        if (s6 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c92(s5);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_else() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c93) {
                                s3 = peg$c93;
                                peg$currPos += 4;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c94); }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsenoNewlineWhitespace();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsenewLine();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c95();
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_end() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 35) {
                        s1 = peg$c42;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c43); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c96) {
                                s3 = peg$c96;
                                peg$currPos += 5;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c97); }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsenoNewlineWhitespace();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsenewLine();
                                    if (s5 === peg$FAILED) {
                                        s5 = peg$parseEOF();
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse_();
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            s1 = [s1, s2, s3, s4, s5, s6];
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_external_branch() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parsepreprocessor_if();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseexternal_statement_list();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsepreprocessor_else_if();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexternal_statement_list();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsepreprocessor_else_if();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseexternal_statement_list();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parsepreprocessor_else();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseexternal_statement_list();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsepreprocessor_end();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c98(s1, s2, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepreprocessor_statement_branch() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parsepreprocessor_if();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsestatement_list();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsepreprocessor_else_if();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsestatement_list();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsepreprocessor_else_if();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsestatement_list();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parsepreprocessor_else();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsestatement_list();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsepreprocessor_end();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c98(s1, s2, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsefunction_definition() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    s1 = peg$parsefunction_prototype();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsecompound_statement();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c99(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsecompound_statement() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parseleft_brace();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsestatement_list();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_brace();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c100(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsestatement_list() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parsestatement_no_new_scope();
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parsestatement_no_new_scope();
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c101(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsestatement_no_new_scope() {
                    var s0;

                    s0 = peg$parsecompound_statement();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsesimple_statement();
                    }

                    return s0;
                }

                function peg$parsestatement_with_scope() {
                    var s0;

                    s0 = peg$parsecompound_statement();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsesimple_statement();
                    }

                    return s0;
                }

                function peg$parsesimple_statement() {
                    var s0, s1;

                    s0 = peg$currPos;
                    s1 = peg$parsedeclaration();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseexpression_statement();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parseselection_statement();
                            if (s1 === peg$FAILED) {
                                s1 = peg$parseiteration_statement();
                                if (s1 === peg$FAILED) {
                                    s1 = peg$parsejump_statement();
                                }
                            }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c102(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parseselection_statement() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c86) {
                        s1 = peg$c86;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c87); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_paren();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseassignment_expression();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseright_paren();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsestatement_with_scope();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$currPos;
                                        if (input.substr(peg$currPos, 4) === peg$c93) {
                                            s7 = peg$c93;
                                            peg$currPos += 4;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse_();
                                            if (s8 === peg$FAILED) {
                                                s8 = null;
                                            }
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parsestatement_with_scope();
                                                if (s9 !== peg$FAILED) {
                                                    s7 = [s7, s8, s9];
                                                    s6 = s7;
                                                } else {
                                                    peg$currPos = s6;
                                                    s6 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s6;
                                                s6 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s6;
                                            s6 = peg$FAILED;
                                        }
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c103(s3, s5, s6);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsefor_loop() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 3) === peg$c104) {
                        s1 = peg$c104;
                        peg$currPos += 3;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c105); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_paren();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseexpression_statement();
                            if (s3 === peg$FAILED) {
                                s3 = peg$parsedeclaration();
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsecondition();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsesemicolon();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parseassignment_expression();
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseright_paren();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parsestatement_no_new_scope();
                                                if (s8 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c106(s3, s4, s6, s8);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsewhile_statement() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 5) === peg$c107) {
                        s1 = peg$c107;
                        peg$currPos += 5;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c108); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_paren();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsecondition();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseright_paren();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c109(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsewhile_loop() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    s1 = peg$parsewhile_statement();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsestatement_no_new_scope();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c110(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedo_while() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c111) {
                        s1 = peg$c111;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c112); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsestatement_with_scope();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsewhile_statement();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c113(s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseiteration_statement() {
                    var s0;

                    s0 = peg$parsewhile_loop();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsedo_while();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsefor_loop();
                        }
                    }

                    return s0;
                }

                function peg$parsejump_statement() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 6) === peg$c114) {
                        s1 = peg$c114;
                        peg$currPos += 6;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c115); }
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c116) {
                            s2 = peg$c116;
                            peg$currPos += 2;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c117); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c118) {
                                s2 = peg$c118;
                                peg$currPos += 2;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c119); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 33) {
                                    s2 = peg$c120;
                                    peg$currPos++;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c121); }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 126) {
                                        s2 = peg$c122;
                                        peg$currPos++;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c123); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 43) {
                                            s2 = peg$c124;
                                            peg$currPos++;
                                        } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c125); }
                                        }
                                        if (s2 === peg$FAILED) {
                                            if (input.charCodeAt(peg$currPos) === 45) {
                                                s2 = peg$c126;
                                                peg$currPos++;
                                            } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c127); }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseassignment_expression();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsesemicolon();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c128(s2, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$currPos;
                        if (input.substr(peg$currPos, 8) === peg$c129) {
                            s2 = peg$c129;
                            peg$currPos += 8;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c130); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsesemicolon();
                            if (s3 !== peg$FAILED) {
                                s2 = [s2, s3];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                        if (s1 === peg$FAILED) {
                            s1 = peg$currPos;
                            if (input.substr(peg$currPos, 5) === peg$c131) {
                                s2 = peg$c131;
                                peg$currPos += 5;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c132); }
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parsesemicolon();
                                if (s3 !== peg$FAILED) {
                                    s2 = [s2, s3];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                            if (s1 === peg$FAILED) {
                                s1 = peg$currPos;
                                if (input.substr(peg$currPos, 6) === peg$c114) {
                                    s2 = peg$c114;
                                    peg$currPos += 6;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c115); }
                                }
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parsesemicolon();
                                    if (s3 !== peg$FAILED) {
                                        s2 = [s2, s3];
                                        s1 = s2;
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c133(s1);
                        }
                        s0 = s1;
                    }

                    return s0;
                }

                function peg$parseexpression_statement() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    s1 = peg$parseassignment_expression();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsesemicolon();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c134(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsesequence_expression() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parseassignment_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseassignment_expression();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseassignment_expression();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c135(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclaration() {
                    var s0, s1, s2, s3, s4;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = peg$parsefunction_prototype();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsesemicolon();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c137(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parselocally_specified_type();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse_();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseinit_declarator_list();
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parsesemicolon();
                                    if (s4 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c138(s1, s3);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c136); }
                    }

                    return s0;
                }

                function peg$parseglobal_declaration() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$parsedeclaration();
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parsefully_specified_type();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse_();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseinit_declarator_list();
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parsesemicolon();
                                    if (s4 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c139(s1, s3);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseattribute_type();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse_();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parsedeclarator_list_no_array();
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parsesemicolon();
                                        if (s4 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c139(s1, s3);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                    }

                    return s0;
                }

                function peg$parsefunction_prototype_parameter_list() {
                    var s0, s1, s2, s3, s4, s5;

                    if (input.substr(peg$currPos, 4) === peg$c140) {
                        s0 = peg$c140;
                        peg$currPos += 4;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c141); }
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseparameter_declaration();
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseparameter_declaration();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                s3 = peg$currPos;
                                s4 = peg$parsecomma();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseparameter_declaration();
                                    if (s5 !== peg$FAILED) {
                                        s4 = [s4, s5];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c142(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parsefunction_prototype() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    s1 = peg$parsevoid_type();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseprecision_type();
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseidentifier();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseleft_paren();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsefunction_prototype_parameter_list();
                                    if (s5 === peg$FAILED) {
                                        s5 = null;
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parseright_paren();
                                        if (s6 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c143(s1, s3, s5);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseparameter_qualifier() {
                    var s0;

                    s0 = peg$c144;

                    return s0;
                }

                function peg$parseparameter_declaration() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parseconst_qualifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        s3 = peg$parseparameter_qualifier();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s3 = [s3, s4];
                                s2 = s3;
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parseprecision_qualifier();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parsetype_name();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parse_();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parseidentifier();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$currPos;
                                            s8 = peg$parseleft_bracket();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseconditional_expression();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parseright_bracket();
                                                    if (s10 !== peg$FAILED) {
                                                        s8 = [s8, s9, s10];
                                                        s7 = s8;
                                                    } else {
                                                        peg$currPos = s7;
                                                        s7 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s7;
                                                    s7 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s7;
                                                s7 = peg$FAILED;
                                            }
                                            if (s7 === peg$FAILED) {
                                                s7 = null;
                                            }
                                            if (s7 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c145(s1, s2, s3, s4, s6, s7);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseinit_declarator_list() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parseinit_declarator();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseinit_declarator();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseinit_declarator();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c146(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclarator_list() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsedeclarator();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedeclarator();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsedeclarator();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c146(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclarator_list_no_array() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsedeclarator_no_array();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedeclarator_no_array();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsedeclarator_no_array();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c146(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclarator_list_arrays_have_size() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsedeclarator_array_with_size();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedeclarator_array_with_size();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsedeclarator_array_with_size();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c146(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclarator_no_array() {
                    var s0, s1;

                    s0 = peg$currPos;
                    s1 = peg$parseidentifier();
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c147(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsedeclarator_array_with_size() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

                    s0 = peg$currPos;
                    s1 = peg$parseidentifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_bracket();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseconditional_expression();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseright_bracket();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$currPos;
                                    s6 = peg$parseequals();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseleft_brace();
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parseinit_list();
                                            if (s8 === peg$FAILED) {
                                                s8 = null;
                                            }
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseright_brace();
                                                if (s9 !== peg$FAILED) {
                                                    s6 = [s6, s7, s8, s9];
                                                    s5 = s6;
                                                } else {
                                                    peg$currPos = s5;
                                                    s5 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                    if (s5 === peg$FAILED) {
                                        s5 = null;
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c148(s1, s3, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsedeclarator_no_array();
                    }

                    return s0;
                }

                function peg$parseinit_list() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parseassignment_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parsecomma();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseassignment_expression();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseassignment_expression();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c149(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsedeclarator() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parseidentifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_bracket();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_bracket();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseequals();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseleft_brace();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parseinit_list();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseright_brace();
                                            if (s7 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c150(s1, s6);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsedeclarator_array_with_size();
                    }

                    return s0;
                }

                function peg$parseinit_declarator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parseidentifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseequals();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseconditional_expression();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c151(s1, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsedeclarator();
                    }

                    return s0;
                }

                function peg$parsemember_list() {
                    var s0, s1, s2, s3, s4, s5, s6;

                    s0 = peg$currPos;
                    s1 = [];
                    s2 = peg$currPos;
                    s3 = peg$parselocally_specified_type();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedeclarator_list_arrays_have_size();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parsesemicolon();
                                if (s6 !== peg$FAILED) {
                                    s3 = [s3, s4, s5, s6];
                                    s2 = s3;
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    if (s2 !== peg$FAILED) {
                        while (s2 !== peg$FAILED) {
                            s1.push(s2);
                            s2 = peg$currPos;
                            s3 = peg$parselocally_specified_type();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsedeclarator_list_arrays_have_size();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parsesemicolon();
                                        if (s6 !== peg$FAILED) {
                                            s3 = [s3, s4, s5, s6];
                                            s2 = s3;
                                        } else {
                                            peg$currPos = s2;
                                            s2 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s2;
                                        s2 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        }
                    } else {
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c152(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsestruct_definition() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parsetype_qualifier();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseattribute_qualifier();
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c153) {
                            s2 = peg$c153;
                            peg$currPos += 6;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c154); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseidentifier();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseleft_brace();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsemember_list();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parseright_brace();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parsesemicolon();
                                            if (s7 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c155(s1, s3, s5);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseprecision_type() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parseprecision_qualifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsetype_name();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c156(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parselocally_specified_type() {
                    var s0, s1, s2, s3;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parseconst_qualifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseprecision_type();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c158(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c157); }
                    }

                    return s0;
                }

                function peg$parseattribute_qualifier() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    peg$savedPos = peg$currPos;
                    s1 = peg$c159();
                    if (s1) {
                        s1 = void 0;
                    } else {
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 9) === peg$c160) {
                            s2 = peg$c160;
                            peg$currPos += 9;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c161); }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c162();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseattribute_type() {
                    var s0, s1, s2, s3;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = peg$parseattribute_qualifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseprecision_type();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c163(s1, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c157); }
                    }

                    return s0;
                }

                function peg$parsefully_specified_type() {
                    var s0, s1, s2, s3;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = peg$parsetype_qualifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseprecision_type();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c158(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c164); }
                    }

                    return s0;
                }

                function peg$parseprecision_qualifier() {
                    var s0, s1;

                    peg$silentFails++;
                    if (input.substr(peg$currPos, 5) === peg$c166) {
                        s0 = peg$c166;
                        peg$currPos += 5;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c167); }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7) === peg$c168) {
                            s0 = peg$c168;
                            peg$currPos += 7;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c169); }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c170) {
                                s0 = peg$c170;
                                peg$currPos += 4;
                            } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c171); }
                            }
                        }
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c165); }
                    }

                    return s0;
                }

                function peg$parseconst_qualifier() {
                    var s0;

                    if (input.substr(peg$currPos, 5) === peg$c172) {
                        s0 = peg$c172;
                        peg$currPos += 5;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c173); }
                    }

                    return s0;
                }

                function peg$parsetype_qualifier() {
                    var s0, s1, s2, s3;

                    peg$silentFails++;
                    s0 = peg$parseconst_qualifier();
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7) === peg$c175) {
                            s0 = peg$c175;
                            peg$currPos += 7;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c176); }
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.substr(peg$currPos, 9) === peg$c177) {
                                s1 = peg$c177;
                                peg$currPos += 9;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c178); }
                            }
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse_();
                                if (s2 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 7) === peg$c175) {
                                        s3 = peg$c175;
                                        peg$currPos += 7;
                                    } else {
                                        s3 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c176); }
                                    }
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c179();
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 7) === peg$c180) {
                                    s0 = peg$c180;
                                    peg$currPos += 7;
                                } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c181); }
                                }
                            }
                        }
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c174); }
                    }

                    return s0;
                }

                function peg$parsevoid_type() {
                    var s0, s1;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 4) === peg$c140) {
                        s1 = peg$c140;
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c141); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c183();
                    }
                    s0 = s1;
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c182); }
                    }

                    return s0;
                }

                function peg$parseprimitive_type_name() {
                    var s0;

                    if (input.substr(peg$currPos, 5) === peg$c184) {
                        s0 = peg$c184;
                        peg$currPos += 5;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c185); }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c186) {
                            s0 = peg$c186;
                            peg$currPos += 3;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c187); }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c188) {
                                s0 = peg$c188;
                                peg$currPos += 4;
                            } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c189); }
                            }
                        }
                    }

                    return s0;
                }

                function peg$parsetype_name() {
                    var s0, s1;

                    peg$silentFails++;
                    s0 = peg$parseprimitive_type_name();
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseidentifier();
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c191(s1);
                        }
                        s0 = s1;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c190); }
                    }

                    return s0;
                }

                function peg$parseidentifier() {
                    var s0, s1, s2, s3, s4;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    peg$silentFails++;
                    s2 = peg$currPos;
                    s3 = peg$parsekeyword();
                    if (s3 !== peg$FAILED) {
                        if (peg$c193.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c194); }
                        }
                        if (s4 !== peg$FAILED) {
                            s3 = [s3, s4];
                            s2 = s3;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s2 === peg$FAILED) {
                        s1 = void 0;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        if (peg$c195.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c196); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            if (peg$c197.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c198); }
                            }
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                if (peg$c197.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c198); }
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c64(s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c192); }
                    }

                    return s0;
                }

                function peg$parsekeyword() {
                    var s0, s1;

                    peg$silentFails++;
                    if (input.substr(peg$currPos, 5) === peg$c184) {
                        s0 = peg$c184;
                        peg$currPos += 5;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c185); }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c200) {
                            s0 = peg$c200;
                            peg$currPos += 6;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c201); }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c186) {
                                s0 = peg$c186;
                                peg$currPos += 3;
                            } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c187); }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4) === peg$c188) {
                                    s0 = peg$c188;
                                    peg$currPos += 4;
                                } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c189); }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c131) {
                                        s0 = peg$c131;
                                        peg$currPos += 5;
                                    } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 8) === peg$c129) {
                                            s0 = peg$c129;
                                            peg$currPos += 8;
                                        } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c130); }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c111) {
                                                s0 = peg$c111;
                                                peg$currPos += 2;
                                            } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 4) === peg$c93) {
                                                    s0 = peg$c93;
                                                    peg$currPos += 4;
                                                } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 3) === peg$c104) {
                                                        s0 = peg$c104;
                                                        peg$currPos += 3;
                                                    } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c105); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 2) === peg$c86) {
                                                            s0 = peg$c86;
                                                            peg$currPos += 2;
                                                        } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c87); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 6) === peg$c114) {
                                                                s0 = peg$c114;
                                                                peg$currPos += 6;
                                                            } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c115); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 5) === peg$c172) {
                                                                    s0 = peg$c172;
                                                                    peg$currPos += 5;
                                                                } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c173); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 6) === peg$c153) {
                                                                        s0 = peg$c153;
                                                                        peg$currPos += 6;
                                                                    } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c154); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 4) === peg$c140) {
                                                                            s0 = peg$c140;
                                                                            peg$currPos += 4;
                                                                        } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c141); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 5) === peg$c107) {
                                                                                s0 = peg$c107;
                                                                                peg$currPos += 5;
                                                                            } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 4) === peg$c202) {
                                                                                    s0 = peg$c202;
                                                                                    peg$currPos += 4;
                                                                                } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c203); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 5) === peg$c204) {
                                                                                        s0 = peg$c204;
                                                                                        peg$currPos += 5;
                                                                                    } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c205); }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c199); }
                    }

                    return s0;
                }

                function peg$parsevector() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c206.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c207); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c208) {
                            s3 = peg$c208;
                            peg$currPos += 3;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c209); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c210.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c211); }
                            }
                            if (s4 !== peg$FAILED) {
                                s2 = [s2, s3, s4];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsematrix() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c213.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c214); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c215) {
                            s3 = peg$c215;
                            peg$currPos += 3;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c216); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c210.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c211); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$currPos;
                                s6 = peg$currPos;
                                if (peg$c217.test(input.charAt(peg$currPos))) {
                                    s7 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c218); }
                                }
                                if (s7 !== peg$FAILED) {
                                    if (peg$c210.test(input.charAt(peg$currPos))) {
                                        s8 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c211); }
                                    }
                                    if (s8 !== peg$FAILED) {
                                        s7 = [s7, s8];
                                        s6 = s7;
                                    } else {
                                        peg$currPos = s6;
                                        s6 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s5 = input.substring(s5, peg$currPos);
                                } else {
                                    s5 = s6;
                                }
                                if (s5 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsesampler() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c219.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c220); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 7) === peg$c221) {
                            s3 = peg$c221;
                            peg$currPos += 7;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c222); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c223.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c224); }
                            }
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 68) {
                                    s5 = peg$c225;
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c226); }
                                }
                                if (s5 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c227) {
                                        s6 = peg$c227;
                                        peg$currPos += 5;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c228); }
                                    }
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        if (input.substr(peg$currPos, 6) === peg$c229) {
                                            s7 = peg$c229;
                                            peg$currPos += 6;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c230); }
                                        }
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s2 = [s2, s3, s4, s5, s6, s7];
                                            s1 = s2;
                                        } else {
                                            peg$currPos = s1;
                                            s1 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsesampler_cube() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c219.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c220); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 11) === peg$c231) {
                            s3 = peg$c231;
                            peg$currPos += 11;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c232); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c227) {
                                s4 = peg$c227;
                                peg$currPos += 5;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c228); }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c229) {
                                    s5 = peg$c229;
                                    peg$currPos += 6;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c230); }
                                }
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsesampler_rect() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c219.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c220); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 13) === peg$c233) {
                            s3 = peg$c233;
                            peg$currPos += 13;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c234); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c229) {
                                s4 = peg$c229;
                                peg$currPos += 6;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c230); }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s2 = [s2, s3, s4];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsesampler_ms() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c219.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c220); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 11) === peg$c235) {
                            s3 = peg$c235;
                            peg$currPos += 11;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c236); }
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c227) {
                                s4 = peg$c227;
                                peg$currPos += 5;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c228); }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s2 = [s2, s3, s4];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsesampler_buffer() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    if (peg$c219.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c220); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 13) === peg$c237) {
                            s3 = peg$c237;
                            peg$currPos += 13;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c238); }
                        }
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c212(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parsereserved() {
                    var s0, s1, s2, s3, s4;

                    peg$silentFails++;
                    s0 = peg$currPos;
                    s1 = [];
                    s2 = peg$parsesingle_underscore_identifier();
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parsesingle_underscore_identifier();
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c240) {
                            s2 = peg$c240;
                            peg$currPos += 2;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c241); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            if (peg$c62.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c63); }
                            }
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                if (peg$c62.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c63); }
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s0 === peg$FAILED) {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c239); }
                    }

                    return s0;
                }

                function peg$parsesingle_underscore_identifier() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = [];
                    if (peg$c242.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c243); }
                    }
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c242.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c243); }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 95) {
                            s2 = peg$c244;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c245); }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            if (peg$c242.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c243); }
                            }
                            if (s4 !== peg$FAILED) {
                                while (s4 !== peg$FAILED) {
                                    s3.push(s4);
                                    if (peg$c242.test(input.charAt(peg$currPos))) {
                                        s4 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c243); }
                                    }
                                }
                            } else {
                                s3 = peg$FAILED;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseint_constant() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    if (peg$c246.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c247); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        if (peg$c248.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c249); }
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c248.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c249); }
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            if (peg$c250.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c251); }
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c252(s1, s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 48) {
                            s1 = peg$c253;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c254); }
                        }
                        if (s1 !== peg$FAILED) {
                            if (peg$c255.test(input.charAt(peg$currPos))) {
                                s2 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c256); }
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = [];
                                if (peg$c257.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c258); }
                                }
                                if (s4 !== peg$FAILED) {
                                    while (s4 !== peg$FAILED) {
                                        s3.push(s4);
                                        if (peg$c257.test(input.charAt(peg$currPos))) {
                                            s4 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s4 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c258); }
                                        }
                                    }
                                } else {
                                    s3 = peg$FAILED;
                                }
                                if (s3 !== peg$FAILED) {
                                    if (peg$c250.test(input.charAt(peg$currPos))) {
                                        s4 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c251); }
                                    }
                                    if (s4 === peg$FAILED) {
                                        s4 = null;
                                    }
                                    if (s4 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c259(s3, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 48) {
                                s1 = peg$c253;
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c254); }
                            }
                            if (s1 !== peg$FAILED) {
                                s2 = [];
                                if (peg$c260.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c261); }
                                }
                                if (s3 !== peg$FAILED) {
                                    while (s3 !== peg$FAILED) {
                                        s2.push(s3);
                                        if (peg$c260.test(input.charAt(peg$currPos))) {
                                            s3 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s3 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c261); }
                                        }
                                    }
                                } else {
                                    s2 = peg$FAILED;
                                }
                                if (s2 !== peg$FAILED) {
                                    if (peg$c250.test(input.charAt(peg$currPos))) {
                                        s3 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s3 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c251); }
                                    }
                                    if (s3 === peg$FAILED) {
                                        s3 = null;
                                    }
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c262(s2, s3);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 48) {
                                    s1 = peg$c253;
                                    peg$currPos++;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c254); }
                                }
                                if (s1 !== peg$FAILED) {
                                    if (peg$c250.test(input.charAt(peg$currPos))) {
                                        s2 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c251); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        s2 = null;
                                    }
                                    if (s2 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c263(s2);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                        }
                    }

                    return s0;
                }

                function peg$parsefloat_constant() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$currPos;
                    s2 = [];
                    if (peg$c264.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c265); }
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c264.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c265); }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 46) {
                            s3 = peg$c266;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c267); }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = [];
                            if (peg$c248.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c249); }
                            }
                            if (s5 !== peg$FAILED) {
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    if (peg$c248.test(input.charAt(peg$currPos))) {
                                        s5 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                    }
                                }
                            } else {
                                s4 = peg$FAILED;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsefloat_exponent();
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = peg$currPos;
                        s2 = [];
                        if (peg$c248.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c249); }
                        }
                        if (s3 !== peg$FAILED) {
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                if (peg$c248.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                }
                            }
                        } else {
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 46) {
                                s3 = peg$c266;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c267); }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = [];
                                if (peg$c248.test(input.charAt(peg$currPos))) {
                                    s5 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                }
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    if (peg$c248.test(input.charAt(peg$currPos))) {
                                        s5 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                    }
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsefloat_exponent();
                                    if (s5 === peg$FAILED) {
                                        s5 = null;
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s2 = [s2, s3, s4, s5];
                                        s1 = s2;
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        if (peg$c268.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c269); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c270) {
                                s2 = peg$c270;
                                peg$currPos += 2;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c271); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c272) {
                                    s2 = peg$c272;
                                    peg$currPos += 2;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c273); }
                                }
                            }
                        }
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c274(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$currPos;
                        s2 = [];
                        if (peg$c264.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c265); }
                        }
                        if (s3 !== peg$FAILED) {
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                if (peg$c264.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c265); }
                                }
                            }
                        } else {
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsefloat_exponent();
                            if (s3 !== peg$FAILED) {
                                s2 = [s2, s3];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                        if (s1 !== peg$FAILED) {
                            if (peg$c275.test(input.charAt(peg$currPos))) {
                                s2 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c276); }
                            }
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c277(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parsefloat_exponent() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    if (peg$c278.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c279); }
                    }
                    if (s1 !== peg$FAILED) {
                        if (peg$c280.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c281); }
                        }
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            if (peg$c248.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c249); }
                            }
                            if (s4 !== peg$FAILED) {
                                while (s4 !== peg$FAILED) {
                                    s3.push(s4);
                                    if (peg$c248.test(input.charAt(peg$currPos))) {
                                        s4 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                    }
                                }
                            } else {
                                s3 = peg$FAILED;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c282(s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseparen_expression() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parseleft_paren();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseassignment_expression();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_paren();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c283(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebool_constant() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 4) === peg$c202) {
                        s1 = peg$c202;
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c203); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c204) {
                            s1 = peg$c204;
                            peg$currPos += 5;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c205); }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c284(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parseprimary_expression() {
                    var s0;

                    s0 = peg$parsefunction_call();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseidentifier();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsefloat_constant();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseint_constant();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parsebool_constant();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseparen_expression();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parsetype_cast();
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return s0;
                }

                function peg$parsetype_cast() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = peg$parseleft_paren();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseprimitive_type_name();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_paren();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseunary_expression();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c285(s2, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseleft_paren();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseprimitive_type_name();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseright_paren();
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parseprimary_expression();
                                    if (s4 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c286(s2, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parseindex_accessor() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parseleft_bracket();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseassignment_expression();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseright_bracket();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c287(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsefield_selector() {
                    var s0, s1, s2;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s1 = peg$c266;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c267); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseidentifier();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c288(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepostfix_expression() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    s1 = peg$parseprimary_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parsefield_selector();
                        if (s3 === peg$FAILED) {
                            s3 = peg$parseindex_accessor();
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parsefield_selector();
                            if (s3 === peg$FAILED) {
                                s3 = peg$parseindex_accessor();
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c289(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsepostfix_expression_no_repeat() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parsepostfix_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c116) {
                                s3 = peg$c116;
                                peg$currPos += 2;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c117); }
                            }
                            if (s3 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c118) {
                                    s3 = peg$c118;
                                    peg$currPos += 2;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c119); }
                                }
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = [];
                                s5 = peg$parsefield_selector();
                                if (s5 === peg$FAILED) {
                                    s5 = peg$parseindex_accessor();
                                }
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    s5 = peg$parsefield_selector();
                                    if (s5 === peg$FAILED) {
                                        s5 = peg$parseindex_accessor();
                                    }
                                }
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c290(s1, s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseparameter_list() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 4) === peg$c140) {
                        s1 = peg$c140;
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c141); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c291();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseassignment_expression();
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            s3 = peg$currPos;
                            s4 = peg$parsecomma();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseassignment_expression();
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                s3 = peg$currPos;
                                s4 = peg$parsecomma();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseassignment_expression();
                                    if (s5 !== peg$FAILED) {
                                        s4 = [s4, s5];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c149(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parsefunction_call() {
                    var s0, s1, s2, s3, s4;

                    s0 = peg$currPos;
                    s1 = peg$parsefunction_identifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseleft_paren();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseparameter_list();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parseright_paren();
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c292(s1, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsefunction_identifier() {
                    var s0, s1;

                    s0 = peg$currPos;
                    s1 = peg$parseidentifier();
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c293(s1);
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsetype_name();
                    }

                    return s0;
                }

                function peg$parseunary_expression() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c116) {
                        s1 = peg$c116;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c117); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c118) {
                            s1 = peg$c118;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c119); }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 33) {
                                s1 = peg$c120;
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c121); }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 126) {
                                    s1 = peg$c122;
                                    peg$currPos++;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c123); }
                                }
                                if (s1 === peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 43) {
                                        s1 = peg$c124;
                                        peg$currPos++;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c125); }
                                    }
                                    if (s1 === peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 45) {
                                            s1 = peg$c126;
                                            peg$currPos++;
                                        } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c127); }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsepostfix_expression_no_repeat();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c294(s1, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemultiplicative_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 42) {
                        s1 = peg$c295;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c296); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 47) {
                            s1 = peg$c297;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c298); }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 37) {
                                s1 = peg$c299;
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c300); }
                            }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c29;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c301(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsemultiplicative_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parseunary_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsemultiplicative_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseunary_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsemultiplicative_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseunary_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseadditive_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 43) {
                        s1 = peg$c124;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c125); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 43) {
                            s3 = peg$c124;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c125); }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 61) {
                                s3 = peg$c29;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c30); }
                            }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c303();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 45) {
                            s1 = peg$c126;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c127); }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = peg$currPos;
                            peg$silentFails++;
                            if (input.charCodeAt(peg$currPos) === 45) {
                                s3 = peg$c126;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c127); }
                            }
                            if (s3 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                    s3 = peg$c29;
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c30); }
                                }
                            }
                            peg$silentFails--;
                            if (s3 === peg$FAILED) {
                                s2 = void 0;
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c304();
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parseadditive_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parsemultiplicative_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseadditive_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsemultiplicative_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseadditive_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsemultiplicative_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseshift_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c305) {
                        s1 = peg$c305;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c306); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c307) {
                            s1 = peg$c307;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c308); }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c29;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c301(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseshift_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parseadditive_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseshift_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseadditive_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseshift_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseadditive_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parserelational_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 60) {
                        s1 = peg$c309;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c310); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 60) {
                            s3 = peg$c309;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c310); }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 61) {
                                s3 = peg$c29;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c30); }
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c311(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 62) {
                            s1 = peg$c312;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c313); }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = peg$currPos;
                            peg$silentFails++;
                            if (input.charCodeAt(peg$currPos) === 62) {
                                s3 = peg$c312;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c313); }
                            }
                            peg$silentFails--;
                            if (s3 === peg$FAILED) {
                                s2 = void 0;
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                            if (s2 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                    s3 = peg$c29;
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c30); }
                                }
                                if (s3 === peg$FAILED) {
                                    s3 = null;
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c314(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }

                    return s0;
                }

                function peg$parserelational_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parseshift_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parserelational_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseshift_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parserelational_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseshift_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseequality_operator() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c315) {
                        s1 = peg$c315;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c316); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c317) {
                            s1 = peg$c317;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c318); }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c319(s1);
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parseequality_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parserelational_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseequality_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parserelational_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseequality_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parserelational_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_and_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 38) {
                        s1 = peg$c320;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c321); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c29;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 38) {
                                s3 = peg$c320;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c321); }
                            }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c322();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_and_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parseequality_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsebitwise_and_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseequality_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsebitwise_and_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseequality_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_xor_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 94) {
                        s1 = peg$c323;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c324); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c29;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 94) {
                                s3 = peg$c323;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c324); }
                            }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c325();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_xor_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parsebitwise_and_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsebitwise_xor_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsebitwise_and_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsebitwise_xor_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsebitwise_and_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_or_operator() {
                    var s0, s1, s2, s3;

                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 124) {
                        s1 = peg$c326;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c327); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        peg$silentFails++;
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c29;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c30); }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 124) {
                                s3 = peg$c326;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c327); }
                            }
                        }
                        peg$silentFails--;
                        if (s3 === peg$FAILED) {
                            s2 = void 0;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c328();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parsebitwise_or_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parsebitwise_xor_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsebitwise_or_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsebitwise_xor_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsebitwise_or_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsebitwise_xor_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parselogical_and_operator() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c329) {
                        s1 = peg$c329;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c330); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c331();
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parselogical_and_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parsebitwise_or_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parselogical_and_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsebitwise_or_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parselogical_and_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsebitwise_or_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parselogical_xor_operator() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c332) {
                        s1 = peg$c332;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c333); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c334();
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parselogical_xor_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parselogical_and_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parselogical_xor_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parselogical_and_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parselogical_xor_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parselogical_and_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parselogical_or_operator() {
                    var s0, s1;

                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c335) {
                        s1 = peg$c335;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c336); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c337();
                    }
                    s0 = s1;

                    return s0;
                }

                function peg$parselogical_or_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parselogical_xor_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parselogical_or_operator();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parselogical_xor_expression();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$currPos;
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parselogical_or_operator();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 === peg$FAILED) {
                                        s6 = null;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parselogical_xor_expression();
                                        if (s7 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c302(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseconditional_expression() {
                    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

                    s0 = peg$currPos;
                    s1 = peg$parselogical_or_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$currPos;
                        s3 = peg$parse_();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 63) {
                                s4 = peg$c338;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c339); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseassignment_expression();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parse_();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            if (input.charCodeAt(peg$currPos) === 58) {
                                                s8 = peg$c340;
                                                peg$currPos++;
                                            } else {
                                                s8 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c341); }
                                            }
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parse_();
                                                if (s9 === peg$FAILED) {
                                                    s9 = null;
                                                }
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parseassignment_expression();
                                                    if (s10 !== peg$FAILED) {
                                                        s3 = [s3, s4, s5, s6, s7, s8, s9, s10];
                                                        s2 = s3;
                                                    } else {
                                                        peg$currPos = s2;
                                                        s2 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s2;
                                                    s2 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s2;
                                                s2 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s2;
                                            s2 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s2;
                                        s2 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c342(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }

                    return s0;
                }

                function peg$parseassignment_expression() {
                    var s0, s1, s2, s3, s4, s5;

                    s0 = peg$currPos;
                    s1 = peg$parseconditional_expression();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 61) {
                                s3 = peg$c29;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c30); }
                            }
                            if (s3 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c343) {
                                    s3 = peg$c343;
                                    peg$currPos += 2;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c344); }
                                }
                                if (s3 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c345) {
                                        s3 = peg$c345;
                                        peg$currPos += 2;
                                    } else {
                                        s3 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c346); }
                                    }
                                    if (s3 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 2) === peg$c347) {
                                            s3 = peg$c347;
                                            peg$currPos += 2;
                                        } else {
                                            s3 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c348); }
                                        }
                                        if (s3 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c349) {
                                                s3 = peg$c349;
                                                peg$currPos += 2;
                                            } else {
                                                s3 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c350); }
                                            }
                                            if (s3 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 2) === peg$c351) {
                                                    s3 = peg$c351;
                                                    peg$currPos += 2;
                                                } else {
                                                    s3 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c352); }
                                                }
                                                if (s3 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 3) === peg$c353) {
                                                        s3 = peg$c353;
                                                        peg$currPos += 3;
                                                    } else {
                                                        s3 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c354); }
                                                    }
                                                    if (s3 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c355) {
                                                            s3 = peg$c355;
                                                            peg$currPos += 3;
                                                        } else {
                                                            s3 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c356); }
                                                        }
                                                        if (s3 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 2) === peg$c357) {
                                                                s3 = peg$c357;
                                                                peg$currPos += 2;
                                                            } else {
                                                                s3 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c358); }
                                                            }
                                                            if (s3 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 2) === peg$c359) {
                                                                    s3 = peg$c359;
                                                                    peg$currPos += 2;
                                                                } else {
                                                                    s3 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c360); }
                                                                }
                                                                if (s3 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 2) === peg$c361) {
                                                                        s3 = peg$c361;
                                                                        peg$currPos += 2;
                                                                    } else {
                                                                        s3 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c362); }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseassignment_expression();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c363(s1, s3, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseconditional_expression();
                    }

                    return s0;
                }

                function peg$parsecondition() {
                    var s0, s1, s2, s3, s4, s5, s6, s7;

                    s0 = peg$currPos;
                    s1 = peg$parselocally_specified_type();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseidentifier();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 61) {
                                        s5 = peg$c29;
                                        peg$currPos++;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c30); }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse_();
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseassignment_expression();
                                            if (s7 !== peg$FAILED) {
                                                s1 = [s1, s2, s3, s4, s5, s6, s7];
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseassignment_expression();
                    }

                    return s0;
                }


                // Map containing the names of structs defined in the shader mapped to "true".
                var typeNames = { };

                // Ideintifer for each node.
                var next_id = 0;

                // The type of shader being parsed.  This sould be set before parsing begins.
                // This allows us to reject invalid constructs such as attribute declaration
                // in a fragment shader or discard ina vertex shader.
                var shaderType = "vs";

                /** @constructor */
                function node(extraProperties) {
                    for (var prop in extraProperties) {
                        if (extraProperties.hasOwnProperty(prop)) {
                            this[prop] = extraProperties[prop];
                        }
                    }
                };

                // Helper function to daisy chain together a series of binary operations.
                function daisy_chain(head, tail) {
                    var result = head;
                    for (var i = 0; i < tail.length; i++) {
                        result = new node({ location: location(),
                            type: "binary",
                            operator: tail[i][1],
                            left: result,
                            right: tail[i][3]
                        });
                    }
                    return result;
                };

                // Generates AST Nodes for a preprocessor branch.
                function preprocessor_branch(if_directive,
                                             elif_directives,
                                             else_directive) {
                    var elseList = elif_directives;
                    if (else_directive) {
                        elseList = elseList.concat([else_directive]);
                    }
                    var result = if_directive[0];
                    result.guarded_statements = if_directive[1].statements;
                    var current_branch = result;
                    for (var i = 0; i < elseList.length; i++) {
                        current_branch.elseBody = elseList[i][0];
                        current_branch.elseBody.guarded_statements =
                            elseList[i][1].statements;
                        current_branch = current_branch.elseBody;
                    }
                    return result;
                };


                peg$result = peg$startRuleFunction();

                if (peg$result !== peg$FAILED && peg$currPos === input.length) {
                    return peg$result;
                } else {
                    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                        peg$fail(peg$endExpectation());
                    }

                    throw peg$buildStructuredError(
                        peg$maxFailExpected,
                        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
                        peg$maxFailPos < input.length
                            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
                    );
                }
            }

            return {
                SyntaxError: peg$SyntaxError,
                parse:       peg$parse
            };
        })();

    exports.parse = pegjs.parse;
    exports.SyntaxError = pegjs.SyntaxError;
});