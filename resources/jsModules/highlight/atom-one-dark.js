import {HighlightStyle, tags, syntaxHighlighting} from "../editor/index.js";

//copied from https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd";

export default syntaxHighlighting(HighlightStyle.define([
  {tag: tags.keyword,
    color: violet},
  {tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: coral},
  {tag: [tags.function(tags.variableName), tags.labelName, tags.function(tags.propertyName)],
    color: malibu},
  {tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: whiskey},
  {tag: [tags.definition(tags.name), tags.separator],
    color: ivory},
  {tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
    color: chalky},
  {tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)],
    color: cyan},
  {tag: [tags.meta, tags.comment],
    color: stone},
  {tag: tags.strong,
    fontWeight: "bold"},
  {tag: tags.emphasis,
    fontStyle: "italic"},
  {tag: tags.strikethrough,
    textDecoration: "line-through"},
  {tag: tags.link,
    color: stone,
    textDecoration: "underline"},
  {tag: tags.heading,
    fontWeight: "bold",
    color: coral},
  {tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
    color: whiskey },
  {tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: sage},
  {tag: tags.invalid,
    color: invalid}
]));