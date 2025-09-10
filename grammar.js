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
      $._expression,
      $._macro,
    ),

    _macro: $ => choice(
      $.global_macro,
      $.code_macro,
      $.include_statement
    ),

    global_macro: $ => seq(
      field("symbol", "%"),
      field("name", $.macro_name),
      "[",
      repeat($._element),
      "]"
    ),

    code_macro: $ => seq(
      field("symbol", "@"),
      field("name", $.macro_name),
      field("body", $._l_expression)
    ),

    include_statement: $ => seq(
      field("symbol", "*"),
      field("file_name", $.string)
    ),

    _expression: $ => choice(
      $.l_expression,
      $.expression
    ),

    expression: $ => seq(
      field("symbol", /[#$&]/),
      field("body", $._expression)
    ),

    l_expression: $ => $._l_expression,

    _l_expression: $ => choice(
      $.l_function,
      $.l_application,
      $.l_variable,
      $.l_macro
    ),

    l_function: $ => seq(
      "\\",
      field("variable", seq(
        repeat(seq(
          $.l_variable,
          ","
        )),
        $.l_variable,)
      ),
      ".",
      field("body", $._l_expression)
    ),

    l_application: $ => seq(
      "(",
      field("function", $._l_expression),
      field("arg", repeat1(seq(
        ",",
        $._l_expression
      ))),
      ")"
    ),

    l_variable: $ => field("name", $.var_name),

    l_macro: $ => field("name", $.macro_name),


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
    macro_name: $ => /[A-Z_]+/,
    string: $ => /"*"/,
  }
});
