"use strict";

const openSplitView = async(numberOfEditors, gridValue) =>{
  if(typeof numberOfEditors !== "number" || numberOfEditors < 1 || numberOfEditors > 6 || typeof gridValue !== "string")
    return;

  if(numberOfEditors > Object.keys(EditorManager.editors).length){
    for(let i = Object.keys(EditorManager.editors).length; i < numberOfEditors; i++){
      await EditorManager.openEditor();

      const editorName = Object.keys(EditorManager.editors).pop();
      const filePath = Object.keys(FileManager.files).pop();
    
      EditorManager.showFileInEditor(editorName, filePath);
    }
  }
  else if (numberOfEditors < Object.keys(EditorManager.editors).length){
    for(let i = Object.keys(EditorManager.editors).length; i > numberOfEditors; i--){
      const editorName = Object.keys(EditorManager.editors).pop();

      await EditorManager.closeEditor(editorName);
    }
  }

  EditorManager.editorParentNode.setAttribute("data-editorContainerGrid", gridValue);
  userPreferences.splitViewType = gridValue;
}

const setSplitView = async (gridValue) =>{
  EditorManager.editorParentNode.setAttribute("data-editorContainerGrid", gridValue);
  userPreferences.splitViewType = gridValue;
}

class EditorManager {
  static editors = {};
  static activeEditorName = null;
  static editorParentNode = document.getElementById("editorContainer-div");
  static isOpened(editorName){
    return EditorManager.editors.hasOwnProperty(editorName);
  }
  static async openEditor(editorName = Object.keys(EditorManager.editors).length){
    const editorNode = document.createElement("div");
  	editorNode.classList.add("editor-div");
    editorNode.setAttribute("data-editorName", editorName);
    EditorManager.editorParentNode.appendChild(editorNode);

    if(window.Editor === null)
      window.Editor = (await import("../jsModules/editor/editor.js")).default;
    
    await EditorManager.compareEditorsChanges();
    
    EditorManager.editors[editorName] = new Editor({
      parentNode: editorNode
    });

    for(const editorName of Object.keys(EditorManager.editors))
      EditorManager.editors[editorName].synchronizeEditor(Object.values(EditorManager.editors));

    if(EditorManager.activeEditorName === null)
      await EditorManager.changeActive(editorName);
  }
  static async changeActive(editorName){
    if(!EditorManager.isOpened(editorName))
      return;
    
    if(EditorManager.activeEditorName)
      try{ EditorManager.editors[EditorManager.activeEditorName].closeSearchPanel();}catch{};

    EditorManager.activeEditorName = editorName;
    
    if(EditorManager.editors[editorName].getActive())
      EditorManager.editors[editorName].openSearchPanel();

    EditorManager.editorInfo(editorName, false);
  }
  static async showDefaultPage(editorName){
    EditorManager.editors[editorName].changeToDefaultState();
  }
  static async showFileInEditor(editorName, filePath){
    if (FileManager.isOpened(filePath) === false || EditorManager.isOpened(editorName) === false)
      return;

    await EditorManager.editors[editorName].compareEditorChanges();
    
    if(FileManager.isInitialized(filePath) === false)
      await FileManager.initializeFile(filePath);
  
    await EditorManager.editors[editorName].changeActiveFile(FileManager.files[filePath]);
  
  	//show editor element
    App.showContent();
    App.showEditorPage();

    await EditorManager.changeActive(editorName)
  	await FileManager.changeActive(filePath);
  }
  static async showFileInEmptyEditors(filePath){
    if(!FileManager.isOpened(filePath))
      return;

    if(FileManager.isInitialized(filePath) === false)
      await FileManager.initializeFile(filePath);

    for(const editorName in EditorManager.editors){
      if(EditorManager.editors[editorName].getActive() === null){
        EditorManager.editors[editorName].changeActiveFile(FileManager.files[filePath]);

        if(EditorManager.activeEditorName === null){
          await EditorManager.changeActive(editorName)
          await FileManager.changeActive(filePath);
        }
      }
    }

    //show editor element
    App.showContent();
    App.showEditorPage(); 
  }
  static async showNextFileInEditor(editorName, filePath){
    if(!EditorManager.isOpened(editorName) || !FileManager.isOpened(filePath))
      return;

    const fileKeys = Object.keys(FileManager.files);
    
    let beforeFileIndex, nextFileIndex;
    for(let i = 0; i<fileKeys.length; i++){
      if(fileKeys[i] === filePath){
        if((i-1)>=0)
          beforeFileIndex = (i-1);
        if((i+1)<fileKeys.length)
          nextFileIndex = (i+1);
      }
    }

    if(nextFileIndex)
      await EditorManager.showFileInEditor(editorName, fileKeys[nextFileIndex]);
    else if(beforeFileIndex)
      await EditorManager.showFileInEditor(editorName, fileKeys[beforeFileIndex]);
    else if(fileKeys.length > 0)
      await EditorManager.showFileInEditor(editorName, fileKeys[0]);
  }
  static async closeEditor(editorName){
    if(EditorManager.isOpened(editorName) === false)
      return;

    if(Object.keys(EditorManager.editors).length === 1)
      App.showStartPage();

    EditorManager.editors[editorName].remove();
    delete EditorManager.editors[editorName];

    EditorManager.changeActive(Object.keys(EditorManager.editors).pop());
  }
  static async compareEditorsChanges(){
    for(const editorName in EditorManager.editors)
      await EditorManager.editors[editorName].compareEditorChanges();
  }
  static searchAndReplace(editorName, config){
    if(!editorName || !EditorManager.editors[editorName] || !config)
      return;
    
    if(config.search && typeof config.search === "string" && !/\S/.test(config.search))
      return;
          
    const lastSearchQuery = EditorManager.editors[editorName].getCurrentSearchQuery() ?? {};
    const lastConfig = {
      search: lastSearchQuery.search,
      caseSensitive: lastSearchQuery.caseSensitive,
      regexp: lastSearchQuery.regexp,
      replace: lastSearchQuery.replace
    };
    
    EditorManager.editors[editorName].searchInEditor({...lastConfig, ...config});
    EditorManager.searchInfo(editorName);
  }
  static searchAndReplaceUsingForm(editorName){
    if(!editorName || !EditorManager.editors[editorName])
      return;
    
    const config = {
      caseSensitive: document.querySelector(`[data-searchInfo='caseSensitive']`).checked,
      regexp: document.querySelector(`[data-searchInfo='regexp']`).checked,
    };

     EditorManager.searchAndReplace(editorName, config);
  }
  static async searchInfo(editorName){
    if(EditorManager.editors[editorName]){
      const lastSearchQuery = EditorManager.editors[editorName].getCurrentSearchQuery() ?? {};
  
      document.querySelector('[data-searchInfo="caseSensitive"]').checked = lastSearchQuery.caseSensitive;
      document.querySelector('[data-searchInfo="regexp"]').checked = lastSearchQuery.regexp;
    }
  }
  static findNext(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].findNext();
  }
  static findPrevious(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].findPrevious();
  }
  static replaceNext(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].replaceNext();
  }
  static replaceAll(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].replaceAll();
  }
  static undo(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].undo();
  }
  static redo(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].redo();
  }
  static async copy(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName]){
      const selection = EditorManager.editors[editorName].getMainSelection();
      if(selection !== undefined && selection.length > 0)
        await Neutralino.clipboard.writeText(selection);
    }
  }
  static async cut(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName]){
      const selection = EditorManager.editors[editorName].getMainSelection();
      if(selection !== undefined && selection.length > 0){
        await Neutralino.clipboard.writeText(selection);
        EditorManager.editors[editorName].replaceSelection("");
      }
    }
  }
  static async paste(editorName = EditorManager.activeEditorName){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].replaceSelection(await Neutralino.clipboard.readText());
  }
  static async insertText(editorName = EditorManager.activeEditorName, text){
    if(EditorManager.editors[editorName])
      EditorManager.editors[editorName].insertText(text);
  }
  static #editorInfoTimeout = null;
  static async editorInfo(editorName, useTimeout = true){
    if(Object.keys(FileManager.files).length === 0 || EditorManager.isOpened(editorName) === false)
      return;
    try{clearTimeout(EditorManager.#editorInfoTimeout)}catch{}
  
 	const editorInfo = EditorManager.editors[editorName].editorInfo();
	const infoFunction = async function () {
      document.querySelector('[data-editorInfo="currentLine"]').textContent = editorInfo?.currentLine ?? "";
      document.querySelector('[data-editorInfo="currentColumn"]').textContent = editorInfo?.currentColumn ?? "";
      document.querySelector('[data-editorInfo="length"]').textContent = editorInfo?.length ?? "";  
	}
  	if (useTimeout === true)
      EditorManager.#editorInfoTimeout = setTimeout(infoFunction, 300);
  	else
      infoFunction();
  }
}