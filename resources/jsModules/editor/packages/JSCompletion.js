import {completeFromList} from "../codemirror.js";

const keywords = [
  {
    label: "break",
    type: "keyword",
    boost: -1
  },
  {
    label: "case",
    type: "keyword",
    boost: -1
  },
  {
    label: "catch",
    type: "keyword",
    boost: -1
  },
  {
    label: "class",
    type: "keyword",
    boost: -1
  },
  {
    label: "const",
    type: "keyword",
    boost: -1
  },
  {
    label: "continue",
    type: "keyword",
    boost: -1
  },
  {
    label: "debugger",
    type: "keyword",
    boost: -1
  },
  {
    label: "default",
    type: "keyword",
    boost: -1
  },
  {
    label: "deconste",
    type: "keyword",
    boost: -1
  },
  {
    label: "do",
    type: "keyword",
    boost: -1
  },
  {
    label: "else",
    type: "keyword",
    boost: -1
  },
  {
    label: "enum",
    type: "keyword",
    boost: -1
  },
  {
    label: "export",
    type: "keyword",
    boost: -1
  },
  {
    label: "extends",
    type: "keyword",
    boost: -1
  },
  {
    label: "false",
    type: "keyword",
    boost: -1
  },
  {
    label: "finally",
    type: "keyword",
    boost: -1
  },
  {
    label: "for",
    type: "keyword",
    boost: -1
  },
  {
    label: "function",
    type: "keyword",
    boost: -1
  },
  {
    label: "if",
    type: "keyword",
    boost: -1
  },
  {
    label: "implements",
    type: "keyword",
    boost: -1
  },
  {
    label: "import",
    type: "keyword",
    boost: -1
  },
  {
    label: "interface",
    type: "keyword",
    boost: -1
  },
  {
    label: "in",
    type: "keyword",
    boost: -1
  },
  {
    label: "instanceof",
    type: "keyword",
    boost: -1
  },
  {
    label: "let",
    type: "keyword",
    boost: -1
  },
  {
    label: "new",
    type: "keyword",
    boost: -1
  },
  {
    label: "package",
    type: "keyword",
    boost: -1
  },
  {
    label: "private",
    type: "keyword",
    boost: -1
  },
  {
    label: "protected",
    type: "keyword",
    boost: -1
  },
  {
    label: "public",
    type: "keyword",
    boost: -1
  },
  {
    label: "readonly",
    type: "keyword",
    boost: -1
  },
  {
    label: "return",
    type: "keyword",
    boost: -1
  },
  {
    label: "static",
    type: "keyword",
    boost: -1
  },
  {
    label: "super",
    type: "keyword",
    boost: -1
  },
  {
    label: "switch",
    type: "keyword",
    boost: -1
  },
  {
    label: "this",
    type: "keyword",
    boost: -1
  },
  {
    label: "throw",
    type: "keyword",
    boost: -1
  },
  {
    label: "true",
    type: "keyword",
    boost: -1
  },
  {
    label: "try",
    type: "keyword",
    boost: -1
  },
  {
    label: "typeof",
    type: "keyword",
    boost: -1
  },
  {
    label: "var",
    type: "keyword",
    boost: -1
  },
  {
    label: "void",
    type: "keyword",
    boost: -1
  },
  {
    label: "while",
    type: "keyword",
    boost: -1
  },
  {
    label: "with",
    type: "keyword",
    boost: -1
  },
  {
    label: "yield",
    type: "keyword",
    boost: -1
  }
];

export default completeFromList([...keywords]);