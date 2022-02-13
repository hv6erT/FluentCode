import {HighlightStyle, tags} from "../editor/index.js";

export default HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#859900' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#839496' },
  // getElementById
  { tag: [tags.propertyName], color: '#268BD2' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#2AA198' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#268BD2' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#CB4B16' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#839496' },
  { tag: [tags.className], color: '#CB4B16' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#D33682' },
  { tag: [tags.typeName], color: '#859900', fontStyle: '' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#859900' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#D30102' },
  { tag: [tags.meta, tags.comment], color: '#657B83' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#268BD2' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#839496' },
  { tag: tags.invalid, color: '' },
]);
