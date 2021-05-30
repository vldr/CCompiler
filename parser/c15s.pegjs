// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
 * This grammar has been significantly modified and extended by the glsl-man
 * project (https://github.com/lammas/glsl-man) to support most current GLSL
 * features.
 */

{
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
}

start
  = external_statement_list

vertex_start
  = &{  shaderType = "vs"; return true; }
    root:external_statement_list {
      return root;
    }

fragment_start
  = &{  shaderType = "fs"; return true; }
    root:external_statement_list {
      return root;
    }

newLine
  = [\n] {
    return "\n";
  }

EOF
  = !.

_ "whitespace"
  = (newLine / [\\\n] / [\r\t\f\v ] / comment)+

noNewlineComment
  = "/*" (!"*/" .)* "*/"
  / "//" [^\n]*

noNewlineWhitespace
  = ([\r\t\f\v ] / noNewlineComment)+

comment "comment"
  = "/*" (!"*/" .)* "*/"
  / "//" [^\n]* (newLine / EOF)

semicolon     = _? ";" _?
comma         = _? "," _?
left_bracket  = _? "[" _?
right_bracket = _? "]" _?
equals        = _? "=" _?
left_paren    = _? "(" _?
right_paren   = _? ")" _?
left_brace    = _? "{" _?
right_brace   = _? "}" _?

external_statement_list
  = statements:external_statement* {
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
    }

external_statement
  = statement:(external_declaration) { return statement; }
  / _ { return ""; }

external_declaration
  = root_function_call
  / function_definition
  / global_declaration
  / struct_definition

// TODO(rowillia):  The preprocessor rules here are a hack.  This won't truely
// parse any available preprocessor rule, only ones that encapsulate full
// statements.  For example, the following is legal:
//
// int i = foo(
// #ifdef BAR
// 1);
// #else
// 2);
// #endif
//
// We can't parse that, and in order to do so we would need a true
// preprocessor.  We believe the above occurance is somewhat rare, so we can
// ignore it for now.
preprocessor_operator
  = "#" directive:("undef" / "pragma"/
                   "version"/ "error" / "extension" /
                   "line" / "include")
    _ value:(defname:[^\n]* {return defname.join("")}) (newLine/EOF) {
    return new node({ location: location(), 
      type: "preprocessor",
      directive: "#" + directive,
      value: value
    });
  }

macro_identifier
  = head:[A-Za-z_] tail:[A-Za-z_0-9]* {
     return new node({ location: location(), 
       type: "identifier",
       name: head + tail.join("")
     });
  }

preprocessor_parameter_list =
  // No space is allowed between a macro's identifier and its opening
  // paren
  "(" head:(macro_identifier)?
  tail:(comma macro_identifier)* right_paren {
    if (!head) {
      return [];
    }
    return [ head ].concat(tail.map(function(item) { return item[1]; }));
  }

macro_paren_parameter =
  left_paren  value:(head:[^()]* paren:macro_paren_parameter? tail:[^()]* {
    return head.join("") + paren + tail.join("");
  }) right_paren {
    return "(" + value + ")";
  }

macro_call_parameter =
  macro_paren_parameter / value:[^,)]* {
    return value.join("");
  }

macro_call_parameter_list =
  head:macro_call_parameter tail:(comma macro_call_parameter)* {
    return [head].concat(tail.map(function(item) { return item[1]; }));
  }

macro_call
  = macro_name:macro_identifier _? left_paren
    // Explicitly use "")" at the end of the line as to not eat any whitespace
    // after the macro call.
    parameters:(parameter_list?) ")" {
      var result = new node({ location: location(), 
        type: "macro_call",
        macro_name: macro_name,
        parameters: parameters
      });
      if (!parameters) {
        result.parameters = [];
      }
      return result;
    }

macro_call_line =
  head:macro_call? tail:[^\n]* {
    return {
      macro_call: head,
      rest_of_line: tail.join('')
    }
  }

preprocessor_define
  = "#" _? "define" _ identifier:macro_identifier
    parameters:preprocessor_parameter_list?
    [ \t]* token_string:(defname:[^\n]* {return defname.join("")})
    (newLine/EOF) {
    return new node({ location: location(), 
         type: "preprocessor",
         directive: "#define",
         identifier: identifier.name,
         token_string: token_string,
         parameters: parameters || null
       });
     }

preprocessor_if
  = "#" _? directive:("ifdef" / "ifndef"/ "if")
     _ value:(defname:[^\n]* {return defname.join("")}) (newLine/EOF) {
       return new node({ location: location(), 
         type: "preprocessor",
         directive: "#" + directive,
         value: value
       });
     }

preprocessor_else_if
  = "#" _? "elif" _ value:(defname:[^\n]* {return defname.join("")})
    (newLine/EOF) {
      return new node({ location: location(), 
        type: "preprocessor",
        directive: "#elif",
        value: value
      });
    }

preprocessor_else
  = "#" _? "else" noNewlineWhitespace? newLine {
    return new node({ location: location(), 
      type: "preprocessor",
      directive: "#else"
    });
  }

preprocessor_end
  = "#" _? "endif" noNewlineWhitespace? (newLine/EOF) _?

preprocessor_external_branch
  = if_directive:(preprocessor_if external_statement_list)
    elif_directive:(preprocessor_else_if external_statement_list)*
    else_directive:(preprocessor_else external_statement_list)?
    preprocessor_end {
      return preprocessor_branch(if_directive, elif_directive, else_directive);
    }

preprocessor_statement_branch
  = if_directive:(preprocessor_if statement_list)
    elif_directive:(preprocessor_else_if statement_list)*
    else_directive:(preprocessor_else statement_list)?
    preprocessor_end {
      return preprocessor_branch(if_directive, elif_directive, else_directive);
    }

function_definition
  = prototype:function_prototype body:compound_statement {
      var result = new node({ location: location(), 
        type: "function_declaration",
        name: prototype.name,
        identifier: prototype.identifier,
        returnType: prototype.returnType,
        parameters: prototype.parameters,
        body: body
      });
      return result;
  }

compound_statement
  = left_brace statements:statement_list? right_brace {
      var result = new node({ location: location(), 
        type: "scope",
        statements: []
      });
      if (statements && statements.statements) {
        result.statements = statements.statements;
      }
      return result;
    }

statement_list
  = _? list:(statement_no_new_scope)* _? {return {statements: list};}

statement_no_new_scope
  = compound_statement
  / simple_statement

statement_with_scope
  = compound_statement
  / simple_statement

simple_statement
  = statement:(declaration_statement
  / expression_statement
  / selection_statement
  / iteration_statement
  / jump_statement) {
    return statement;
  }

declaration_statement
  = declaration

selection_statement
  = "if" left_paren condition:expression right_paren
     if_body:statement_with_scope
     else_body:("else" (_)? statement_with_scope)? {
       var result = new node({ location: location(), 
         type:"if_statement",
         condition:condition,
         body:if_body
       });
       if (else_body) {
         result.elseBody = else_body[2];
       }
       return result;
     }

for_loop
  =  "for" left_paren
      initializer:(expression_statement / declaration_statement)
      condition:condition? semicolon
      increment:expression? right_paren
      body:statement_no_new_scope {
        return new node({ location: location(), 
          type:"for_statement",
          initializer:initializer,
          condition:condition,
          increment:increment,
          body:body
        });
      }

while_statement
  = "while" left_paren condition:condition right_paren  {
       return {
         condition:condition
       };
     }

while_loop
  = w:while_statement body:statement_no_new_scope  {
      return new node({ location: location(), 
        type: "while_statement",
        condition: w.condition,
        body: body
      });
    }

do_while
  = "do" body:statement_with_scope w:while_statement {
       return new node({ location: location(), 
         type: "do_statement",
         condition: w.condition,
         body: body
       });
     }

iteration_statement
  = while_loop
  / do_while
  / for_loop

jump_statement
  = "return" head:("++" / "--" / "!" / "~" / "+" / "-")? _? expression:expression semicolon {
      return new node({ location: location(), 
        type: "return",
        value: expression
      });
    }
  / type:("continue" semicolon
          / "break" semicolon
          / "return" semicolon) {
            return new node({ location: location(), 
              type:type[0]
            });
          }

expression_statement
  = e:expression? semicolon {
      return new node({ location: location(), 
        type: "expression",
        expression: e
      });
  }

sequence_expression
  = head:assignment_expression tail:(comma assignment_expression)* {
      return new node({ location: location(), 
        type: "sequence",
        expressions: [ head ].concat(tail.map(function(item) { return item[1] }))
      })
    }

declaration "declaration"
  = function_prototype:function_prototype semicolon {
      return function_prototype;
    }
  / type:locally_specified_type _ declarators:init_declarator_list semicolon {
      return new node({ location: location(), 
        type: "declarator",
        typeAttribute: type,
        declarators: declarators
      });
    }


global_declaration
  = declaration
  / type:fully_specified_type _ declarators:init_declarator_list semicolon {
    return new node({ location: location(), 
      type: "declarator",
      typeAttribute: type,
      declarators: declarators
    });
  }
  / type:attribute_type _ declarators:declarator_list_no_array semicolon {
    return new node({ location: location(), 
      type: "declarator",
      typeAttribute: type,
      declarators: declarators
    });
  }


function_prototype_parameter_list
  = "void" /
    head:parameter_declaration
    tail:(comma parameter_declaration)* {
      return [ head ].concat(tail.map(function(item) { return item[1]; }));
    }

function_prototype
  = type:(void_type/precision_type) _
    identifier:identifier left_paren
    parameters:function_prototype_parameter_list? right_paren {
      var result = new node({ location: location(), 
        type:"function_prototype",
        name: identifier.name,
        identifier: identifier,
        returnType: type,
        parameters: parameters
      });
      if (parameters == "void" || !parameters) {
        result.parameters = [];
      }
      return result;
    }

parameter_qualifier
  = ""

parameter_declaration
  = const_qualifier:(const_qualifier _)?
    parameter:(parameter_qualifier _)?
    precision:(precision_qualifier _)?
    type_name:type_name _
    identifier:identifier array_size:(left_bracket
                                      constant_expression
                                      right_bracket)?
  {
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
  }

init_declarator_list
  = head:init_declarator tail:(comma init_declarator)* {
    return [ head ].concat(tail.map(function(item) { return item[1]; }));
  }

declarator_list
  = head:declarator tail:(comma declarator)* {
    return [ head ].concat(tail.map(function(item) { return item[1]; }));
  }

declarator_list_no_array
  = head:declarator_no_array tail:(comma declarator_no_array)* {
    return [ head ].concat(tail.map(function(item) { return item[1]; }));
  }

declarator_list_arrays_have_size
  = head:declarator_array_with_size tail:(comma declarator_array_with_size)* {
    return [ head ].concat(tail.map(function(item) { return item[1]; }));
  }

declarator_no_array
  = name:identifier {
      return new node({ location: location(), 
        type: "declarator_item",
        name:name
      });
    }

declarator_array_with_size
  = name:identifier left_bracket arraySize:constant_expression right_bracket
    list:(equals left_brace (init_list?) right_brace)?
  {
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
    }
  / declarator_no_array

init_list
  = head:assignment_expression tail:(comma assignment_expression)* {
      return [ head ].concat(tail.map(function(item) { return item[1] }));
    }

declarator
  = name:identifier left_bracket right_bracket
        equals left_brace initList:(init_list) right_brace
        {
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
        }
  / declarator_array_with_size

init_declarator
  = name:identifier equals initializer:constant_expression {
      return new node({ location: location(), 
        type: "declarator_item",
        name: name,
        initializer:initializer
      });
    }
  / declarator

member_list
  = declarators:(locally_specified_type _
                 declarator_list_arrays_have_size
                 semicolon)+ {
     return declarators.map(function(item) {
       return new node({ location: location(), 
         type: "declarator",
         typeAttribute: item[0],
         declarators: item[2]
       })
      });
  }

struct_definition
  = qualifier:((type_qualifier/attribute_qualifier) _)? "struct"
    identifier:(_ identifier)? left_brace
    members:member_list
    right_brace semicolon {
      var result = new node({ location: location(), 
        type: "struct_definition",
        members:members
      });
      if (qualifier) {
        result.qualifier = qualifier[0];
      }
      if (identifier) {
        result.identifier = identifier[1];
        result.name = identifier[1].name;
        typeNames[result.name] = result;
      }
      return result;
    }

constant_expression
  = conditional_expression

precision_type
  = precision:(precision_qualifier _)? name:type_name {
    var result = new node({ location: location(), 
      type: "type",
      name: name
    });
    if (precision) result.precision = precision[0];
    return result;
  }

locally_specified_type "locally specified type"
  = qualifier:(const_qualifier _)? type:precision_type {
    var result = type;
    if (qualifier) result.qualifier = qualifier[0];
    return result;
  }

attribute_qualifier
  = &{ return shaderType == "vs"; }("attribute") {
    return "attribute";
  }

attribute_type "locally specified type"
  = qualifier:attribute_qualifier _ type:precision_type {
    var result = type;
    result.qualifier = qualifier;
    return result;
  }

fully_specified_type "fully specified type"
  = qualifier:(type_qualifier _)? type:precision_type {
    var result = type;
    if (qualifier) result.qualifier = qualifier[0];
    return result;
  }

precision_qualifier "precision qualifier"
  = "highp" / "mediump" / "lowp"

const_qualifier
  = "const"

type_qualifier "type qualifier"
  = const_qualifier
  / "varying"
  / "invariant" _ "varying" { return "invariant varying"; }
  / "uniform"

void_type "void"
  = "void" {
    return new node({ location: location(), 
      type: "type",
      name: "void"
    })
  }

primitive_type_name
  = "float"
  / "int"
  / "uint"

type_name "type name"
  = primitive_type_name
  / name:identifier {
      return name.name;
    }


identifier "identifier"
  = !(keyword [^A-Za-z_0-9]) head:[\$A-Za-z_] tail:[\$A-Za-z_0-9]* {
     return new node({ location: location(), 
       type: "identifier",
       name: head + tail.join("")
     });
  }

keyword "keyword"
  = "float" / "double" / "int" / "uint"
  / "break" / "continue" / "do" / "else" / "for" / "if"
  / "return" / "const" / "struct" / "void"
  / "while" / "true" / "false"


/*
Types:
	bvecn: a vector of booleans
	ivecn: a vector of signed integers
	uvecn: a vector of unsigned integers
	vecn:  a vector of single-precision floating-point numbers
	dvecn: a vector of double-precision floating-point numbers
*/
vector = a:([biud]? "vec" [234]) { return a.join(""); }

/*
All matrix types are floating-point, either single-precision or double-precision.
Matrix types are as follows, where n and m can be the numbers 2, 3, or 4:

	matnxm: A matrix with n columns and m rows. OpenGL uses column-major matrices.
	matn: A matrix with n columns and n rows. Shorthand for matnxn
	Double-precision matrices (GL 4.0 and above) can be declared with a dmat instead of mat
*/
matrix = a:([d]? "mat" [234] $([x] [234])?) { return a.join(""); }

sampler = a:([iu]? "sampler" [123] "D" "Array"? "Shadow"?) { return a.join(""); }
sampler_cube = a:([iu]? "samplerCube" "Array"? "Shadow"?) { return a.join(""); }
sampler_rect = a:([iu]? "sampler2DRect" "Shadow"?) { return a.join(""); }
sampler_ms = a:([iu]? "sampler2DMS" "Array"?) { return a.join(""); }
sampler_buffer = a:([iu]? "samplerBuffer") { return a.join(""); }

reserved "reserved name"
  = single_underscore_identifier* "__" [A-Za-z_0-9]*

single_underscore_identifier
  = [A-Za-z0-9]* "_" [A-Za-z0-9]+

int_constant
  = head:[1-9] tail:[0-9]* unsigned:[Uu]? {
      return new node({ location: location(), 
        type: unsigned ? "uint" : "int",
        format: "number",
        value_base10: parseInt([head].concat(tail).join(""), 10),
        value: [head].concat(tail).join("") + (unsigned ? unsigned : '')
      });
    }
  / "0"[Xx] digits:[0-9A-Fa-f]+ unsigned:[Uu]? {
      return new node({ location: location(), 
        type: unsigned ? "uint" : "int",
        format: "hex",
        value_base10: parseInt(digits.join(""), 16),
        value: "0x" + digits.join("") + (unsigned ? unsigned : '')
      });
    }
  / "0" digits:[0-7]+ unsigned:[Uu]? {
      return new node({ location: location(), 
        type: unsigned ? "uint" : "int",
        format: "octal",
        value_base10: parseInt(digits.join(""), 8),
        value: "0" + digits.join("") + (unsigned ? unsigned : '')
      });
    }
  / "0" unsigned:[Uu]? {
      return new node({ location: location(), 
        type: unsigned ? "uint" : "int",
        format: "number",
        value_base10: 0,
        value: "0" + (unsigned ? unsigned : '')
      });
    }

float_constant
  = digits:([\-0-9]*"."[0-9]+float_exponent? / [0-9]+"."[0-9]*float_exponent?) suffix:([fF] / "lf" / "LF")?
    {
      digits[0] = digits[0].join("");
      digits[2] = digits[2].join("");
      return new node({ location: location(), 
        type: "float",
        value_base10: parseFloat(digits.join("")),
        value: digits.join("") + (suffix ? suffix : '')
      });
    }
  / digits:([\-0-9]+float_exponent) suffix:[f]? {
      return new node({ location: location(), 
        type: "float",
        value_base10: parseFloat(digits[0].join("") + digits[1]),
        value: digits.join("") + (suffix ? suffix : '')
      });
  }

float_exponent
  = [Ee] sign:[+-]? exponent:[0-9]+ {
      return ["e", sign].concat(exponent).join("");
   }

paren_expression
  = left_paren expression:expression right_paren {
      return expression;
    }

primary_expression
  = function_call
  / identifier
  / float_constant
  / int_constant
  / paren_expression
  / type_cast
  
type_cast
  = left_paren t:primitive_type_name right_paren exp:unary_expression {
        return new node({ location: location(), 
           type: "type_cast",
           cast_to: t,
           expression: exp
        });
      }
  / left_paren t:primitive_type_name right_paren exp:primary_expression {
      return new node({ location: location(), 
         type: "type_cast",
         cast_to: t,
         expression: exp
      });
    }

index_accessor
  = left_bracket index:expression right_bracket {
    return new node({ location: location(), 
      type: "accessor",
      index: index
    });
  }

field_selector
  = "." id:identifier {
    return new node({ location: location(), 
      type: "field_selector",
      selection: id.name
    })
  }

postfix_expression
  = head:primary_expression
    tail:(field_selector / index_accessor)*
    {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = new node({ location: location(), 
          type: "postfix",
          operator: tail[i],
          expression: result
        })
      }
      return result;
    }

postfix_expression_no_repeat
  = head:postfix_expression _?
    tail:("++" / "--")?
    rest:(field_selector / index_accessor)* {
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
    }

parameter_list
  = "void" {return []; }
  / head:assignment_expression tail:(comma assignment_expression)* {
      return [ head ].concat(tail.map(function(item) { return item[1] }));
    }

root_function_call = func:function_call semicolon {
    return func;
}

function_call
  = function_name:function_identifier left_paren
    parameters:(parameter_list?) right_paren {
      var result = new node({ location: location(), 
        type: "function_call",
        identifier: function_name,
        function_name: function_name.name,
        parameters: parameters
      });
      if (!parameters) {
        result.parameters = [];
      }
      return result;
    }

function_identifier
  = id:identifier {
      return id;
  }

unary_expression
  = head:("++" / "--" / "!" / "~" / "+" / "-")? _?
    tail:postfix_expression_no_repeat {
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

        if (head === "-")
        {
            if (
                (result.expression.type === "int" && result.expression.format === "number" && result.expression.value_base10 > 0) ||
                (result.expression.type === "float" && result.expression.value_base10 > 0)
            )
            {
                tail.value_base10 *= -1;
                tail.value = "-" + tail.value;

                return tail;
            }
        }
      }

      return result;
    }

multiplicative_operator
  = operator:("*" / "/" / "%") !"=" {
    return new node({ location: location(), 
      type: "operator",
      operator: operator
    });
  }

multiplicative_expression
  = head:unary_expression
    tail:(_? multiplicative_operator _? unary_expression)* {
      return daisy_chain(head, tail);
    }

additive_operator
  = "+" !("+" / "=") {
    return new node({ location: location(), 
      type: "operator",
      operator: "+"
    });
  }
  / "-" !("-" / "=") {
    return new node({ location: location(), 
      type: "operator",
      operator: "-"
    });
  }

additive_expression
  = head:multiplicative_expression
    tail:(_? additive_operator _? multiplicative_expression)* {
      return daisy_chain(head, tail);
    }

shift_operator
  = operator:("<<" / ">>") !"=" {
    return new node({ location: location(), 
      type: "operator",
      operator: operator
    });
  }

shift_expression
  = head:additive_expression
    tail:(_? shift_operator _? additive_expression)* {
      return daisy_chain(head, tail);
    }

relational_operator
  = "<" !("<") equal:("=")? {
    return new node({ location: location(), 
      type: "operator",
      operator: "<" + (equal ? equal : '')
    });
  }
  / ">" !(">") equal:("=")? {
    return new node({ location: location(), 
      type: "operator",
      operator: ">" + (equal ? equal : '')
    });
  }

relational_expression
  = head:shift_expression
    tail:(_? relational_operator _? shift_expression)* {
      return daisy_chain(head, tail);
    }

equality_operator
 = operator:("==" / "!=") {
     return new node({ location: location(), 
       type: "operator",
       operator: operator
     });
   }

equality_expression
  = head:relational_expression
    tail:(_? equality_operator _? relational_expression)* {
      return daisy_chain(head, tail);
    }

bitwise_and_operator
  = "&" !("="/"&") {
     return new node({ location: location(), 
       type: "operator",
       operator: "&"
     });
   }

bitwise_and_expression
  = head:equality_expression
    tail:(_? bitwise_and_operator _? equality_expression)* {
      return daisy_chain(head, tail);
    }

bitwise_xor_operator
  = "^" !("="/"^") {
     return new node({ location: location(), 
       type: "operator",
       operator: "^"
     });
   }

bitwise_xor_expression
  = head:bitwise_and_expression
    tail:(_? bitwise_xor_operator _? bitwise_and_expression)* {
      return daisy_chain(head, tail);
    }

bitwise_or_operator
  = "|" !("="/"|") {
     return new node({ location: location(), 
       type: "operator",
       operator: "|"
     });
   }

bitwise_or_expression
  = head:bitwise_xor_expression
    tail:(_? bitwise_or_operator _? bitwise_xor_expression)* {
      return daisy_chain(head, tail);
    }

logical_and_operator
 = "&&" {
     return new node({ location: location(), 
       type: "operator",
       operator: "&&"
     });
   }

logical_and_expression
  = head:bitwise_or_expression
    tail:(_? logical_and_operator _? bitwise_or_expression)* {
      return daisy_chain(head, tail);
    }

logical_xor_operator
 = "^^" {
     return new node({ location: location(), 
       type: "operator",
       operator: "^^"
     });
   }

logical_xor_expression
  = head:logical_and_expression
    tail:(_? logical_xor_operator _? logical_and_expression)* {
      return daisy_chain(head, tail);
    }

logical_or_operator
 = "||" {
     return new node({ location: location(), 
       type: "operator",
       operator: "||"
     });
   }

logical_or_expression
  = head:logical_xor_expression
    tail:(_? logical_or_operator _? logical_xor_expression)* {
      return daisy_chain(head, tail);
    }

conditional_expression
  = head:logical_or_expression
    tail:(_? "?" _? expression _? ":" _? assignment_expression)? {
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
    }

assignment_expression
  = variable:conditional_expression _?
    operator:("=" / "*=" / "/=" / "%=" /
              "+=" / "-=" / "<<=" / ">>=" /
              "&=" / "^=" / "|=") _?
    expression:assignment_expression {
      return new node({ location: location(), 
        type: "binary",
        operator: new node({ location: location(), 
          type: "operator",
          operator: operator
        }),
        left: variable,
        right: expression
      });
    }
  / conditional_expression

expression
  = assignment_expression

condition
  = locally_specified_type _ identifier _? "=" _? initializer
  / expression

initializer
  = assignment_expression