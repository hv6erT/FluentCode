import {EditorView} from "../editor/index.js";

export default EditorView.theme({
  "&": {
    lineHeight: "1em",
    caretColor: "transparent",
    height: "inherit",
    outline: "none !important"
  },
  ".cm-searchMatch": {
    borderRadius: "3px",
    border: "1px solid var(--third-bg-color)"
  },
  ".cm-searchMatch-selected": {
    border: "2px solid var(--basic-color)"
  },
  "&.cm-focused .cm-cursor": {
    height: "1.2em"
  },
  ".cm-scroller":{
    outline: "none !important"
  },
  ".cm-gutters": {
    userSelect: "none",
    padding: "0 5px"
  },
  ".cm-panels": {
    position: "static !important",
    display: "flex",
    backgroundColor: "transparent !important",
    border: "none",
    fontWeight: "normal"
  },
  ".cm-panel": {
    display: "flex",
    backgroundColor: "transparent",
    padding: "0 !important"
  }
});