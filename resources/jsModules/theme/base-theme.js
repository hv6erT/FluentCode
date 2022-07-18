import {EditorView} from "../editor/index.js";

export default EditorView.theme({
  ".cm-tooltip": {
    maxWidth: "300px",
    padding: "3px",
    backgroundColor: "var(--first-bg-color)",
    color: "var(--color)",
    border: "2px solid var(--second-bg-color)",
    borderRadius: "6px"
  },
  ".cm-tooltip-autocomplete > ul > li": {
    borderRadius: "3px",
    padding: "3px 0"
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--accent-bg-color) !important",
    color: "var(--basic-color) !important"
  },
  ".cm-progress-bar":{
    width: "100%",
    height: "4px",
    margin: "0",
    position: "sticky",
    zIndex: "100",
    transitionDuration: "1s",
    appearance: "none",
    borderRadius: "0"
  },
  ".cm-progress-bar::-webkit-progress-bar": {
    backgroundColor: "transparent"
  },
  ".cm-progress-bar::-webkit-progress-value": {
    backgroundColor: "var(--third-bg-color)"
  },
  ".cm-color-preview-background":{
    width: "40px",
    height: "40px",
    boxSizing: "border-box",
    borderRadius: "6px",
    border: "4px solid var(--third-bg-color)",
    backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEX////Dw8Pb29vz8/Pn5+fPz8/k5OTg4ODs7OzW1tbwviBrAAAAo0lEQVRIx9WTPQoCQQyFU+gBoicw+FNLQLATCdiKELDWG4hX2BPshTd1tkiR5u10D74ZmO8lFGfH/CRaM28iMPON6My8JVpFWAYgIn+zj8jR7BHBzH4ie7O7yCnC7EZ+EQJw96/q4P5WvURQ1YP7qHp1f0WAUN0Gym9CdFEB5chBqG4DEKr7QC4nlwehugTyouRFglDdBspvQnRRAeXIQahuAxNvHqitIul4lQAAAABJRU5ErkJggg==")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    zIndex: "200",
    bottom: "150%",
    left: "50%"
  },
  ".cm-color-preview":{
    zIndex: "100",
    borderRadius: "4px"
  }
});