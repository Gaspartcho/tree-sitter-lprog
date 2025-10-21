/**
 * @file The official tree-sitter grammar for the Lambda Prog (\lprog) language.
 * @author Gaspartcho <g.deremble@laposte.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lprog",

  extras: ($) => [/\s|\\\r?\n/, $.comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat($._expression),

    _expression: ($) =>
      choice(
        $.function,
        $.application,
        $.variable,
        $.macro,
        $.directive,
        $.string,
        $.dire_loop,
      ),

    function: ($) =>
      seq(
        "\\",
        seq(
          repeat(seq(field("variable", $.variable), optional(","))),
          field("variable", $.variable),
        ),
        ".",
        field("body", $._expression),
      ),

    application: ($) =>
      seq(
        "(",
        field("function", $._expression),
        repeat(seq(optional(","), field("arg", $._expression))),
        ")",
      ),

    dire_loop: ($) => seq("[", field("body", $.directive), "]"),

    // Taken from the c grammar
    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: ($) => seq("%", repeat(/[^%]/), "%"),

    variable: ($) => /[a-z_]+/,
    macro: ($) => /[A-Z_]+/,
    string: ($) => /"[^"]*"/,
    directive: ($) => /[#$&@\*!?\+\-]+/,
  },
});
