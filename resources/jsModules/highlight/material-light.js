import {HighlightStyle, tags, syntaxHighlighting} from "../editor/index.js";

export default syntaxHighlighting(HighlightStyle.define([
  // const, let, function, if
  { tag: tags.keyword, color: '#39ADB5' },
  // document
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#90A4AE' },
  // getElementById
  { tag: [tags.propertyName], color: '#6182B8' },
  // "string"
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: '#91B859' },
  // render
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#6182B8' },
  // ???
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#39ADB5' },
  // btn, count, fn render()
  { tag: [tags.definition(tags.name), tags.separator], color: '#90A4AE' },
  { tag: [tags.className], color: '#E2931D' },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#F76D47' },
  { tag: [tags.typeName], color: '#E2931D', fontStyle: '' },
  { tag: [tags.operator, tags.operatorKeyword], color: '#39ADB5' },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#91B859' },
  { tag: [tags.meta, tags.comment], color: '#90A4AE' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#39ADB5' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#90A4AE' },
  { tag: tags.invalid, color: '#E5393570' },
]));
