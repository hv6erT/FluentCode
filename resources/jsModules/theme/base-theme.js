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
  ".cm-color-preview":{
    backgroundColor: "var(--third-bg-color)",
    zIndex: "100",
    borderRadius: "2px"
  },
  ".cm-color-preview-background":{
    width: "40px",
    height: "40px",
    boxSizing: "border-box",
    borderRadius: "2px",
    border: "2px solid var(--second-bg-color)",
    backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEX////Dw8Pb29vz8/Pn5+fPz8/k5OTg4ODs7OzW1tbwviBrAAAAo0lEQVRIx9WTPQoCQQyFU+gBoicw+FNLQLATCdiKELDWG4hX2BPshTd1tkiR5u10D74ZmO8lFGfH/CRaM28iMPON6My8JVpFWAYgIn+zj8jR7BHBzH4ie7O7yCnC7EZ+EQJw96/q4P5WvURQ1YP7qHp1f0WAUN0Gym9CdFEB5chBqG4DEKr7QC4nlwehugTyouRFglDdBspvQnRRAeXIQahuAxNvHqitIul4lQAAAABJRU5ErkJggg==")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    zIndex: "200",
    bottom: "150%",
    left: "50%",
    "&::after": {
      content: '""',
      position: "absolute",
      display: "block",
      top: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: "var(--second-bg-color) transparent transparent transparent"
    }
  },
  ".cm-selection-tooltip":{
    width: "80px",
    height: "20px",
    padding: "5px",
    overflow: "hidden",
    display: "flex"
  }
});