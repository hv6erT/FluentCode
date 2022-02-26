const createSplitView = async () =>{
  if(Object.keys(FileManager.files).length === 0)
    return;
  
  await EditorManager.openEditor();

  const editorName = Object.keys(EditorManager.editors).pop();
  const filePath = Object.keys(FileManager.files).pop();

  EditorManager.showFileInEditor(editorName, filePath);
}

const exitSplitView = async () =>{
  if(Object.keys(FileManager.files).length === 0 || Object.keys(EditorManager.editors).length <= 1)
    return;
  
  const editorName = Object.keys(EditorManager.editors).pop();

  await EditorManager.closeEditor(editorName);
}

class EditorManager {
  static editors = {};
  static activeEditorName = null;
  static isOpened(editorName){
    return EditorManager.editors.hasOwnProperty(editorName);
  }
  static async openEditor(editorName){
    if(editorName === undefined)
      editorName = Object.keys(EditorManager.editors).length;

    const editorNode = document.createElement("div");
  	editorNode.classList.add("editor-div");
    editorNode.setAttribute("data-editorName", editorName);
    document.getElementById("editor-article").appendChild(editorNode);
    
    const nodeWidth = 100 / (Object.keys(EditorManager.editors).length + 1) + "%";
    for(const node of Array.from(document.getElementById("editor-article").childNodes))
      node.style.width = nodeWidth;

    await EditorManager.compareEditorsChanges();

    if(window.Editor === null)
      window.Editor = (await import("../jsModules/editor/editor.js")).default;
    
    EditorManager.editors[editorName] = new Editor({
      parentNode: editorNode
    });

    for(const editorName of Object.keys(EditorManager.editors))
      EditorManager.editors[editorName].synchronizeEditor(Object.values(EditorManager.editors));

    if(Object.keys(EditorManager.editors).length === 1)
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
  static async showFileInEditor(editorName, filePath){
    if (FileManager.isOpened(filePath) === false || EditorManager.isOpened(editorName) === false)
      return;

    await EditorManager.editors[editorName].compareEditorChanges();
    
    if(FileManager.isInitialized(filePath) === false)
      await FileManager.initializeFile(filePath);
  
    await EditorManager.editors[editorName].changeActiveFile(FileManager.files[filePath]);
  
  	//show editor element
    showContentMain();
    showEditorArticle();

    await EditorManager.changeActive(editorName)
  	await FileManager.changeActive(filePath);
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
      showEditorStartPageArticle();

    EditorManager.editors[editorName].remove();
    delete EditorManager.editors[editorName];

    EditorManager.changeActive(Object.keys(EditorManager.editors).pop());

    const nodeWidth = 100 / (Object.keys(EditorManager.editors).length)+ "%";
    for(const node of Array.from(document.querySelectorAll("[data-editorName]")))
      node.style.width = nodeWidth;
  }
  static async compareEditorsChanges(){
    for(const editorName in EditorManager.editors)
      await EditorManager.editors[editorName].compareEditorChanges();
  }
  static searchAndReplace(config){
    if(!config || !EditorManager.editors[EditorManager.activeEditorName])
      return;
    
    if(config.search && typeof config.search === "string" && !/\S/.test(config.search))
      return;
          
    const lastSearchQuery = EditorManager.editors[EditorManager.activeEditorName].getCurrentSearchQuery() ?? {};
    const lastConfig = {
      search: lastSearchQuery.search,
      caseSensitive: lastSearchQuery.caseSensitive,
      regexp: lastSearchQuery.regexp,
      replace: lastSearchQuery.replace
    };
    
    EditorManager.editors[EditorManager.activeEditorName].searchInEditor({...lastConfig, ...config});
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