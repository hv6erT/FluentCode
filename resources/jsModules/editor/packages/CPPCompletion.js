import {completeFromList} from "../codemirror.js";

const types = [
  {
    label: "bool",
    type: "type",
    boost: -2
  },
  {
    label: "char",
    type: "keyword",
    boost: -2
  },
  {
    label: "class",
    type: "keyword",
    boost: -2
  },
  {
    label: "float",
    type: "type",
    boost: -2},
  {
    label: "const",
    type: "type",
    boost: -2
  },
  {
    label: "double",
    type: "type",
    boost: -2
  },
  {
    label: "int",
    type: "type",
    boost: -2
  },
  {
    label: "long",
    type: "type",
    boost: -2
  },
  {
    label: "struct",
    type: "type",
    boost: -2
  },
  {
    label: "wchar_t",
    type: "type",
    boost: -2
  },
  {
    label: "enum",
    type: "type",
    boost: -2
  },
  {
    label: "short",
    type: "type",
    boost: -2
  },
  {
    label: "unsigned",
    type: "type",
    boost: -2
  },
  {
    label: "virtual",
    type: "type",
    boost: -2
  },
  {
    label: "char8_t",
    type: "type",
    boost: -2
  },
  {
    label: "char16_t",
    type: "type",
    boost: -2
  },
  {
    label: "char32_t",
    type: "type",
    boost: -2
  },
  {
    Label: "compl",
    type: "type",
    boost: -2
  },
  {
    label: "concept",
    type: "type",
    boost: -2
  },
  {
    label: "const_cast",
    type: "type",
    boost: -2
  }
];

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
    label: "for",
    type: "keyword",
    boost: -1
  },
  {
    label: "continue",
    type: "keyword",
    boost: -1
  },
  {
    label: "default",
    type: "keyword",
    boost: -1
  },
  {
    label: "delete",
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
    label: "if",
    type: "keyword",
    boost: -1
  },
  {
    label: "namespace",
    type: "keyword",
    boost: -1
  },
  {
    label: "new",
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
    label: "switch",
    type: "keyword",
    boost: -1
  },
  {
    label: "return",
    type: "keyword",
    boost: -1
  },
  {
    label: "sizeof",
    type: "keyword",
    boost: -1
  },
  {
    label: "static",
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
    label: "try",
    type: "keyword",
    boost: -1
  },
  {
    label: "using",
    type: "keyword",
    boost: -1
  },
  {
    label: "declaration",
    type: "keyword",
    boost: -1
  },
  {
    label: "using",
    type: "keyword",
    boost: -1
  },
  {
    label: "directive",
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
    label: "alignas",
    type: "keyword",
    boost: -2
  },
  {
    label: "alignof",
    type: "keyword",
    boost: -2
  },
  {
    label: "and",
    type: "keyword",
    boost: -2
  },
  {
    label: "and_eq",
    type: "keyword",
    boost: -2
  },
  {
    label: "asm",
    type: "keyword",
    boost: -2
  },
  {
    label: "auto",
    type: "keyword",
    boost: -2
  },
  {
    label: "bitand",
    type: "keyword",
    boost: -2
  },
  {
    label: "bitor",
    type: "keyword",
    boost: -2
  },
  {
    label: "consteval",
    type: "keyword",
    boost: -2
  },
  {
    label: "constexpr",
    type: "keyword",
    boost: -2
  },
  {
    label: "constinit",
    type: "keyword",
    boost: -2
  },
  {
    label: "co_await",
    type: "keyword",
    boost: -2
  },
  {
    label: "co_return",
    type: "keyword",
    boost: -2
  },
  {
    label: "co_yield",
    type: "keyword",
    boost: -2
  },
  {
    label: "decltype",
    type: "keyword",
    boost: -2
  },
  {
    label: "dynamic_cast",
    type: "keyword",
    boost: -2
  },
  {
    label: "explicit",
    type: "keyword",
    boost: -2
  },
  {
    label: "export",
    type: "keyword",
    boost: -2
  },
  {
    label: "extern",
    type: "keyword",
    boost: -2
  },
  {
    label: "friend",
    type: "keyword",
    boost: -2
  },
  {
    label: "goto",
    type: "keyword",
    boost: -2
  },
  {
    label: "inline",
    type: "keyword",
    boost: -2
  },
  {
    label: "mutable",
    type: "keyword",
    boost: -2
  },
  {
    label: "noexcept",
    type: "keyword",
    boost: -2
  },
  {
    label: "not",
    type: "keyword",
    boost: -2
  },
  {
    label: "not_eq",
    type: "keyword",
    boost: -2
  },
  {
    label: "nullptr",
    type: "keyword",
    boost: -2
  },
  {
    label: "operator",
    type: "keyword",
    boost: -2
  },
  {
    label: "or",
    type: "keyword",
    boost: -2
  },
  {
    label: "or_eq",
    type: "keyword",
    boost: -2
  },
  {
    label: "register",
    type: "keyword",
    boost: -2
  },
  {
    label: "reinterpret_cast",
    type: "keyword",
    boost: -2
  },
  {
    label: "requires",
    type: "keyword",
    boost: -2
  },
  {
    label: "signed",
    type: "keyword",
    boost: -2
  },
  {
    label: "static_assert",
    type: "keyword",
    boost: -2
  },
  {
    label: "static_cast",
    type: "keyword",
    boost: -2
  },
  {
    label: "template",
    type: "keyword",
    boost: -2
  },
  {
    label: "thread_local",
    type: "keyword",
    boost: -2
  },
  {
    label: "typedef",
    type: "keyword",
    boost: -2
  },
  {
    label: "typeid",
    type: "keyword",
    boost: -2
  },
  {
    label: "typename",
    type: "keyword",
    boost: -2
  },
  {
    label: "union",
    type: "keyword",
    boost: -2
  },
  {
    label: "volatile",
    type: "keyword",
    boost: -2
  },
  {
    label: "xor",
    type: "keyword",
    boost: -2
  },
  {
    label: "xor_eq",
    type: "keyword",
    boost: -2
}];

const namespaces = [
  {
    label: "std",
    type: "namespace",
    boost: 0
  },
  {
    label: "ios",
    type: "namespace",
    boost: 0
}];

export default completeFromList([...keywords, ...types, ...namespaces]);