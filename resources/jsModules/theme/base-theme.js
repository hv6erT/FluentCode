import {EditorView} from "../editor/index.js";

export default EditorView.theme({
  ".cm-tooltip": {
    backgroundColor: "var(--second-bg-color)",
    color: "var(--basic-color)",
    border: "none",
    borderRadius: "6px",
    padding: "3px"
  },
  ".cm-tooltip-autocomplete > ul > li": {
    borderRadius: "3px"
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--accent-bg-color) !important"
  },
  ".cm-progress-bar":{
    width: "100%",
    height: "2px",
    margin: "0",
    position: "sticky",
    zIndex: "100",
    transitionDuration: "1s"
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
  },
  ".cm-selection-tooltip":{
    width: "80px",
    height: "20px",
    padding: "5px",
    overflow: "hidden",
    display: "flex"
  }
});