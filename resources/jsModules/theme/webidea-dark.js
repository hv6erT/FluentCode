import {EditorView} from "../editor/index.js";

const fontColor = "#e9e9e9";

export default EditorView.theme({
  "&": {
    color: fontColor,
    fontFamily: "'Consolas', 'Courier New', monospace, serif",
    fontWeight: "bold"
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: fontColor
  },
  ".cm-gutters": {
    backgroundColor: "var(--first-bg-color)",
    color: "var(--third-bg-color)",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: fontColor
  },
  "&.cm-focused .cm-cursor": {
    borderLeft: "2px solid lightgray",
  },
  "&.cm-focused .cm-selectionBackground, .cm-searchMatch": {
    backgroundColor: "var(--second-bg-color)",
    borderRadius: "3px"
  },
  ".cm-activeLine": {
    backgroundColor: "transparent"
  },
  ".cm-matchingBracket": {
    outline: "1px solid var(--basic-color)",
    color: fontColor
  },
  ".cm-nonmatchingBracket": {
    outline: "1px solid var(--basic-color)",
    backgroundColor: "#FF2C2C",
    color: fontColor
  }
}, {dark: true});