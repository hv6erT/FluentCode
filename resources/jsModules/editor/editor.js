import File from "./file.js";

import {EditorView, EditorState, Annotation} from "./codemirror.js";
import {SearchQuery, setSearchQuery, getSearchQuery} from "./codemirror.js";

const syncAnnotation = Annotation.define();

export default class Editor extends EventTarget {
  constructor(options){
    super();

    const defaultOptions = {
      parentNode: document.body,
      defaultState: EditorState.create({
        doc: 'Open file to start editing'
      })
    };

    this.options = {...defaultOptions, ...options};

    this.#view = new EditorView({
      state: this.options.defaultState,
      parent: this.options.parentNode,
      dispatch: this.#synchronizeEditorChanges()
    });
  }
  #active = null;
  #view = null
  getView(){
    return this.#view;
  }
  getActive(){
    return this.#active;
  }
  async openSearchPanel(){
    (await import("./codemirror.js")).openSearchPanel(this.#view);
    this.#view.focus();
  }
  async closeSearchPanel(){
    (await import("./codemirror.js")).closeSearchPanel(this.#view);
  }
  async findNext(){
    (await import("./codemirror.js")).findNext(this.#view);
  }
  async findPrevious(){
    (await import("./codemirror.js")).findPrevious(this.#view);
  }
  async replaceNext(){
    (await import("./codemirror.js")).replaceNext(this.#view);
  }
  async replaceAll(){
    (await import("./codemirror.js")).replaceAll(this.#view);
  }
  async undo(){
    (await import("./codemirror.js")).undoSelection(this.#view);
  }
  async redo(){
    (await import("./codemirror.js")).redoSelection(this.#view);
  }
  insertText(text, position){
    if(typeof text !== "string")
      throw new Error("Text param could be only typeof string");

    if(position === undefined)
      position = EditorInfo.getCurrentPosition(this).currentPosition;
          
    if(typeof position !== "number")
      throw new Error("Position param could be only typeof number");
      
    this.#view.dispatch({changes: {from: position, insert: text}});
  }
  getMainSelection(){
    return this.#view.state.sliceDoc(
    this.#view.state.selection.main.from,
    this.#view.state.selection.main.to);
  }
  getSelections(){
  	return this.#view.state.selection.ranges.map(r => this.#view.state.sliceDoc(r.from, r.to));
  }
  async replaceSelection(text){
    if(typeof text !== "string")
      throw new Error("Text param should be only typeof string");
    this.#view.dispatch(this.#view.state.replaceSelection(text));
  }
  async compareWithFileChanges(){
    if (this.#active == null)
      return;
    
    const newDocString = this.#active.state.doc.toString();
    const oldDocString = this.#view.state.doc.toString();
    if(newDocString !== oldDocString){
      this.#view.setState(this.#active.state);
      this.dispatchEvent(new Event("editor-update"));
    }
  }
  async compareEditorChanges(){
    if (this.#active != null){
      this.#active.setState(this.#view.state);
      this.dispatchEvent(new Event("active-state-update"));
    }
  }
  async changeActiveFile(file){
    if(!file || !file instanceof File)
      throw new Error("Invalid value of first param, cannot set values other than File instance");

    if(file.isInitialized() === false)
      throw new Error("Cannot changeActiveFile of file that is not initialized");

    if (this.#active == file)
      return;

    await this.compareEditorChanges();

    const self = this;
    const updateEditorStateFunction = function(){
      self.compareFileChanges();
    };

    if (this.#active){
      this.#active.removeEventListener("file-state-change", updateEditorStateFunction, false);
    }
    this.#active = file;
    this.#active.addEventListener("file-state-change", updateEditorStateFunction);
    this.#view.setState(file.getState());
    this.dispatchEvent(new Event("active-state-change"));

	this.#view.scrollPosIntoView(EditorInfo.getCurrentPosition(this).currentPosition || 0); 
    this.#view.focus();
  }
  async searchInEditor(config){
    if(!config)
      throw new Error("Wrong value of config param");

    const defaultConfig = {
      search: "",
      caseSensitive: true,
      regexp: false,
      replace: ""
    };
    
    const newSearchQuery = new SearchQuery({...defaultConfig, ...config});
    this.#view.dispatch({effects: setSearchQuery.of(newSearchQuery)});
    this.dispatchEvent(new Event("editor-search-query-change"));
  }
  getCurrentSearchQuery(){
      return getSearchQuery(this.#view.state);
  }
  editorInfo(){
    return new EditorInfo(this);
  }
  #synchronizedEditors = [];
  #synchronizeEditorChanges(){
    const self = this;
    return function(tr){
      self.getView().update([tr]);
      if(!tr.changes.empty && !tr.annotation(syncAnnotation)){
        for(const editor of self.#synchronizedEditors){
          if(editor.active && self.active && editor.active.path === self.active.path){
            editor.getView().dispatch({
              changes: tr.changes,
              annotations: syncAnnotation.of("editor-synchronize-changes")
            });
          }
        }
        self.dispatchEvent(new Event("editor-synchronize-changes"));
      }
    }
  }
  //removes all synchronized editors and synchronize news
  synchronizeEditor(editorArray){
    if(!editorArray)
      throw new Error("Invalid value of first parametr");
    
    if(Array.isArray(editorArray) === false)
      editorArray = [editorArray];

    this.#synchronizedEditors = [];
    for(const editor of editorArray){
      if(!editor instanceof Editor)
        throw new Error("First argument could be only instance of Editor or Editor Array");
      
      if(!this.#synchronizedEditors.includes(editor) && this.options.parentNode != editor.options.parentNode){
        this.#synchronizedEditors.push(editor);
        this.dispatchEvent(new Event("editor-synchronize"));
      }
    }
  }
  toSerelizedObject(){      	
    return {
      active: (this.#active instanceof File)? this.#active.toSerelizedObject() : null
    };
  }
  toJSON(){
    return JSON.stringify(this.toSerelizedObject());
  }  
}

class EditorInfo {
  constructor(editor) {
    this.length = editor.getView().state.doc.length;
    
    this.lines = EditorInfo.countLines(editor);
    this.words = EditorInfo.countWords(editor);
    this.direction = editor.getView().textDirection;
    this.lineWrapping = editor.getView().lineWrapping;
    
	const currentPos = EditorInfo.getCurrentPosition(editor);
    
    this.currentLine = currentPos.currentLine;
    this.currentColumn = currentPos.currentColumn;
    this.currentPosition = currentPos.currentPosition;
  }
  static getCurrentPosition(editor) {
    let line, column;
    try{
      editor.getView().state.selection.ranges.filter(range => range.empty).forEach(range => {
      line = editor.getView().state.doc.lineAt(range.head);
        column = (range.head - line.from);
      });
    }catch{}

    return {
      currentPosition: (line?.from + column) ?? null,
      currentLine: line?.number ?? null,
      currentColumn: column ?? null
    }
  }
  static countLines(editor) {
    return editor.getView().state.doc.lines;
  }
  static countWords(editor) {
    let doc = editor.getView().state.doc;
    let count = 0, iter = doc.iter();
    while (!iter.next().done) {
      let inWord = false;
      for (let i = 0; i < iter.value.length; i++) {
        let word = /\w/.test(iter.value[i]);
        if (word && !inWord) count++
        inWord = word;
      }
    }
    return count;
  }
}