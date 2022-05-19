export { EditorView, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap, ViewPlugin, hoverTooltip, showTooltip, panels,lineNumbers, highlightActiveLineGutter, rectangularSelection} from "@codemirror/view";
export { EditorState, Annotation, StateField} from "@codemirror/state";
export { indentOnInput, bracketMatching, foldGutter, foldKeymap, defaultHighlightStyle, HighlightStyle, syntaxHighlighting} from "@codemirror/language";
export { tags} from "@lezer/highlight";
export { defaultKeymap, indentWithTab, history, historyKeymap, undoSelection, redoSelection, undoDepth, redoDepth} from "@codemirror/commands";
export { highlightSelectionMatches, searchKeymap, openSearchPanel, closeSearchPanel, findNext, findPrevious, replaceNext, replaceAll, SearchQuery, setSearchQuery, getSearchQuery, search } from "@codemirror/search";
export { autocompletion, completionKeymap, completeAnyWord, completeFromList, ifNotIn, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
export { lintKeymap } from "@codemirror/lint";

export { htmlLanguage, html } from "@codemirror/lang-html";
export { cssLanguage, css } from "@codemirror/lang-css";
export { javascriptLanguage, typescriptLanguage, javascript } from "@codemirror/lang-javascript";
export { jsonLanguage, json } from "@codemirror/lang-json";
export { javaLanguage, java } from "@codemirror/lang-java";
export { cppLanguage, cpp } from "@codemirror/lang-cpp";
export { rustLanguage, rust } from "@codemirror/lang-rust";
export { phpLanguage, php } from "@codemirror/lang-php";
export { xmlLanguage, xml } from "@codemirror/lang-xml";
