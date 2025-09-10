/**
 * @file The official tree-sitter grammar for the Lambda Prog (\lprog) language.
 * @author Gaspartcho <g.deremble@laposte.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lprog",


  extras: $ => [
    /\s|\\\r?\n/,
    $.comment
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._element),

    _element: $ => choice(
      $.expression,
      $.global_macro,
      $.code_macro,
      $.include_statement,
      $.macro_expr
    ),

    global_macro: $ => seq(
      field("symbol", $.macro_symbol),
      field("name", $.g_macro_name),
      "[",
      repeat($._element),
      "]"
    ),

    code_macro: $ => seq(
      field("symbol", $.macro_symbol),
      field("name", $.c_macro_name),
      field("body", $._l_expression)
    ),

    include_statement: $ => seq(
      field("symbol", $.macro_symbol),
      field("file_name", $.string)
    ),

    macro_expr: $ => seq(
      field("name", $.g_macro_name),
      choice(
        ";",
        field("arg", $._expression)
      )
    ),

    _expression: $ => choice(
      $.l_expression,
      $.expression
    ),

    expression: $ => prec.right(seq(
      field("symbol", $.expr_symbol),
      optional(field("arg", $._expression))
    )),

    l_expression: $ => $._l_expression,

    _l_expression: $ => choice(
      $.l_function,
      $.l_application,
      $.l_variable,
      $.l_macro
    ),

    l_function: $ => seq(
      "\\",
      seq(
        repeat(seq(
          field("variable", $.l_variable),
          ","
        )),
        field("variable", $.l_variable)
      ),
      ".",
      field("body", $._l_expression)
    ),

    l_application: $ => seq(
      "(",
      field("function", $._l_expression),
      repeat1(seq(
        ",",
        field("arg", $._l_expression)
      )),
      ")"
    ),

    l_variable: $ => field("name", $.var_name),

    l_macro: $ => field("name", $.c_macro_name),


    // Taken from the c grammar
    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: _ => token(choice(
      seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),

    var_name: $ => /[a-z_]+/,
    c_macro_name: $ => /[A-Z][A-Z_]*/,
    g_macro_name: $ => /_[A-Z_]+/,
    string: $ => /"[a-zA-Z0-9/]*"/,
    expr_symbol: $ => /[#$&]/,
    macro_symbol: $ => /[%@*]/
  }
});
