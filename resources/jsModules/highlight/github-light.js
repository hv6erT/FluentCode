import {HighlightStyle, tags} from "../editor/index.js";

export default HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#d73a49' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#24292e' },
  // getElementById
  { tag: [tags.propertyName], color: '#6f42c1' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#032f62' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#6f42c1' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#005cc5' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#24292e' },
  { tag: [tags.className], color: '#6f42c1' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#005cc5' },
  { tag: [tags.typeName], color: '#005cc5', fontStyle: '' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#d73a49' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#032f62' },
  { tag: [tags.meta, tags.comment], color: '#6a737d' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#005cc5' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#24292e' },
  { tag: tags.invalid, color: '#cb2431' },
]);
