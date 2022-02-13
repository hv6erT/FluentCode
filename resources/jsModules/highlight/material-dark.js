import {HighlightStyle, tags} from "../editor/index.js";

export default  HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#89DDFF' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#EEFFFF' },
  // getElementById
  { tag: [tags.propertyName], color: '#82AAFF' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#C3E88D' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#82AAFF' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#89DDFF' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#EEFFFF' },
  { tag: [tags.className], color: '#FFCB6B' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#F78C6C' },
  { tag: [tags.typeName], color: '#FFCB6B', fontStyle: '' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#89DDFF' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#C3E88D' },
  { tag: [tags.meta, tags.comment], color: '#546E7A' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#89DDFF' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#EEFFFF' },
  { tag: tags.invalid, color: '#f0717870' },
]);
