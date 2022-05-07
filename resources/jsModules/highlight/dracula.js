import {HighlightStyle, tags, syntaxHighlighting} from "../editor/index.js";

export default syntaxHighlighting(HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#FF79C6' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#BD93F9' },
  // getElementById
  { tag: [tags.propertyName], color: '#50FA7B' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#F1FA8C' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#50FA7B' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#BD93F9' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#BD93F9' },
  { tag: [tags.className], color: '#8BE9FD' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#BD93F9' },
  { tag: [tags.typeName], color: '#8BE9FD', fontStyle: 'italic' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#FF79C6' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#F1FA8C' },
  { tag: [tags.meta, tags.comment], color: '#6272A4' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#BD93F9' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#BD93F9' },
  { tag: tags.invalid, color: '#FF5555' },
]));
