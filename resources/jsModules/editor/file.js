//basic setup
import { EditorView, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from "./codemirror.js";
import { EditorState } from "./codemirror.js";
import { history, historyKeymap } from "./codemirror.js";
import { foldGutter, foldKeymap } from "./codemirror.js";
import { indentOnInput } from "./codemirror.js";
import { lineNumbers, highlightActiveLineGutter } from "./codemirror.js";
import { defaultKeymap } from "./codemirror.js";
import { bracketMatching } from "./codemirror.js";
import { closeBrackets, closeBracketsKeymap } from "./codemirror.js";
import { highlightSelectionMatches, searchKeymap } from "./codemirror.js";
import { autocompletion, completionKeymap } from "./codemirror.js";
import { rectangularSelection } from "./codemirror.js";
import { lintKeymap } from "./codemirror.js";

//other setup
import { indentWithTab, panels } from "./codemirror.js";

//others
import Language from "./language.js";
import Features from "./features.js";

export default class File extends EventTarget{
  constructor(options, language = null){
    super();

    const defaultOptions = {
      tabSize: 4,
      fontSize: 13,
      lineWrapping: false,
      tabSupport: true,
      keymap: true,
      lineNumbers: true,
      multipleSelections: true,
      foldGutter: true,
      matchSelections: true,
      matchBrackets: true,
      closeBrackets: true,
      panelNode: null,
      progressBar: false,
      colorPreview: false,
      customSelectionTooltip: false,
      customSearchPanel: false,
      languageSupport: true,
      languageAutocomplete: true,
      anyWordAutocomplete: true,
      theme: [],
      highlight: []
    };

    this.options = {...defaultOptions, ...options};
    this.language = language;
    this.changed = false; 
  }
  #state = null;
  async init(doc) {
    if(typeof doc !== "string")
      throw new Error("Doc param need to be typeof string");

    const didStateExist = (this.#state === null)? false : true;

    this.#state = EditorState.create({
      doc: doc,
      extensions: await File.#getFileExtensionsValue(this)
    });  

    if(didStateExist === true)
      this.dispatchEvent(new Event("file-state-change"));
  }
  getDoc() {
    if(this.isInitialized() === false)
      throw new Error("Cannot get doc when file is not initialized");

    return this.#state.doc.toString();
  }
  setState(state){
    if(!state instanceof EditorState)
      throw new Error("Invalid state value");
    this.#state = state;
  }
  getState() {
    if(this.isInitialized() === false)
      throw new Error("Cannot get state when file is not initialized");
    
    return this.#state;
  }
  isInitialized() {
    return (this.#state !== null);
  }
  fileInfo(){
    return new FileInfo(this);
  }
  toSerelizedObject() {
    return {
      state: this.isInitialized() ? this.#state.toJSON() : null,
      language: this.language
    };	
  }
  toJSON() {
    return JSON.stringify(this.toSerelizedObject());
  }
  static getLanguageNameFromExtension(extName){
    if(!extName || typeof extName !== "string")
      throw new Error("Invalid value of extName param");

    return Language.detectLanguageFromExtension(extName);
  };
  static getLanguageNameFromFilename(fileName){
    if(!fileName || typeof fileName !== "string")
      throw new Error("Invalid value of fileName param");

    if(fileName.lastIndexOf(".") !== undefined)
      return Language.detectLanguageFromExtension(fileName.slice((fileName.lastIndexOf(".") - (fileName.length -1))));
    else return null;
  }
  static async #getFileExtensionsValue(file){
    let stateExtensions = [];
    
    //internal extensions
	stateExtensions.push(EditorView.updateListener.of(function(update) {
      if (update.docChanged){
        file.changed = true;
        file.dispatchEvent(new CustomEvent("state-doc-change", {detail: update}));
      }
    }));

    stateExtensions.push(EditorView.domEventHandlers({
      change(event, view){file.dispatchEvent(new CustomEvent("state-change", {detail: view}));},
      click(event, view){file.dispatchEvent(new CustomEvent("state-click", {detail: view}));},
      input(event, view){file.dispatchEvent(new CustomEvent("state-input", {detail: view}));},
      keyup(event, view){file.dispatchEvent(new CustomEvent("state-keyup", {detail: view}));},
      keydown(event, view){file.dispatchEvent(new CustomEvent("state-keydown", {detail: view}));},
      scroll(event, view){file.dispatchEvent(new CustomEvent("state-scroll", {detail: view}));}
    }));
    
    //basic insternal extensions
    stateExtensions.push([
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      autocompletion(),
      rectangularSelection(),
      highlightActiveLine()
    ]);
    
    //basic external extensions
    if (file.options.tabSize && typeof file.options.tabSize === "Number")
      stateExtensions.push(EditorState.tabSize.of(file.options.tabSize));

    if (file.options.fontSize){
      stateExtensions.push(EditorView.theme({
        "&":{
          fontSize: file.options.fontSize
        }
      }));
    }

    if (file.options.lineWrapping === true)
      stateExtensions.push(EditorView.lineWrapping);

    if(file.options.tabSupport === false)
      stateExtensions.push(keymap.of(indentWithTab));

    if(file.options.keymap === true)
      stateExtensions.push(keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
      ]));
    else if(file.options.keymap)
      stateExtensions.push(keymap.of(keymap));

    if(file.options.lineNumbers === true)
      stateExtensions.push(lineNumbers());

    if(file.options.multipleSelections === true)
      stateExtensions.push(EditorState.allowMultipleSelections.of(true));

    if(file.options.foldGutter === true)
      stateExtensions.push(foldGutter());

    if(file.options.matchSelections === true)
      stateExtensions.push(highlightSelectionMatches());
    
    if(file.options.matchBrackets === true)
      stateExtensions.push(bracketMatching());
    
    if(file.options.closeBrackets === true)
      stateExtensions.push(closeBrackets());

    if (file.options.panelNode && file.options.panelNode instanceof Element)
      stateExtensions.push(panels({
        topContainer: file.options.panelNode,
        bottomContainer: file.options.panelNode,
      }));

    if (file.options.languageSupport === true && file.language){
      const languageSupport = await Language.languageSupportFromLanguageName(file.language);
      if (languageSupport)
        stateExtensions.push(languageSupport);
    }
    
    if (file.options.languageAutocomplete === true && file.language){
      const languageAutocomplete = await Language.autocompleteFromLanguageName(file.language);
      if (languageAutocomplete)
        stateExtensions.push(languageAutocomplete);
    }
    
    if (file.options.anyWordAutocomplete === true && file.language){
      const anyWordAutocomplete = await Language.autocompleteAnyWordFromLanguageName(file.language);
      if (anyWordAutocomplete)
        stateExtensions.push(anyWordAutocomplete);
    }
    
    if (file.options.progressBar === true)
      stateExtensions.push(await Features.scrollProgressBar());
    
    if (file.options.colorPreview === true)
      stateExtensions.push(await Features.colorPreviewTooltip());
    
    if (file.options.customSelectionTooltip !== false)
      stateExtensions.push(await Features.customSelectionTooltip(file.options.customSelectionTooltip));
    
    if (file.options.customSearchPanel !== false)
      stateExtensions.push(await Features.customSearchPanel(file.options.customSearchPanel));

    //custom external extensions
    if(file.options.theme && Array.isArray(file.options.theme))
      stateExtensions.push(...file.options.theme);
    
    if(file.options.highlight && Array.isArray(file.options.highlight))
      stateExtensions.push(...file.options.highlight);
    
    return stateExtensions;
  }
}

class FileInfo{
  constructor(file){
    this.language = file.language;
  }
}