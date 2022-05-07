import {HighlightStyle, tags, syntaxHighlighting} from "../editor/index.js";

export default syntaxHighlighting(HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#f97583' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#e1e4e8' },
  // getElementById
  { tag: [tags.propertyName], color: '#b392f0' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#9ecbff' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#b392f0' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#79b8ff' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#e1e4e8' },
  { tag: [tags.className], color: '#b392f0' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#79b8ff' },
  { tag: [tags.typeName], color: '#79b8ff', fontStyle: '' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#f97583' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#dbedff' },
  { tag: [tags.meta, tags.comment], color: '#6a737d' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#79b8ff' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#e1e4e8' },
  { tag: tags.invalid, color: '#f97583' },
]));
