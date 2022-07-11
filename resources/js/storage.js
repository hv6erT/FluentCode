"use strict";

const openFilesAndEditorsFromStorage = async () => {
  const fileObject = await Storage.getFileKeys();
  const editorObject = await Storage.getEditorKeys();
  
  editorKeyFor: for(const editorKey in editorObject){
    if(editorKey != 0)
      await EditorManager.openEditor(editorKey);

    const fileObjectToShow = editorObject[editorKey].active;
    
    if(fileObjectToShow){
      for(const filePath in fileObject){
        if(JSON.stringify(fileObject[filePath]) === JSON.stringify(fileObjectToShow)){
          await FileManager.openFile(filePath);
          if(FileManager.isOpened(filePath) === true){
            EditorManager.showFileInEditor(editorKey, filePath);
            continue editorKeyFor;
          }
          else
            delete fileObject[filePath];
        }
      }
    }
  }
  
  setSplitView((await Storage.getAdditionalInfo())?.splitViewType ?? Object.keys(EditorManager.editors).length.toString());
  
  const openFilePromises = [];
  
  for(const filePath in fileObject){
    if(FileManager.isOpened(filePath) === false)
      openFilePromises.push(FileManager.openFile(filePath));
  }

  await Promise.allSettled(openFilePromises);

  if(Object.keys(FileManager.files).length > 0)
    EditorManager.showFileInEmptyEditors(Object.keys(FileManager.files)[0]);

  const additionalFileInfo = (await Storage.getAdditionalInfo())?.additionalFileInfo;
  
  for(const filePath in additionalFileInfo){
    FileManager.setAdditionalFileInfo(filePath, additionalFileInfo[filePath]);
  }
}

const openLastFilesFromStorage = async () => {
  const fileObject = await Storage.getLastFileKeys();

  const openFilePromises = [];
  for(const fileKey in fileObject)
    openFilePromises.push(FileManager.openFile(fileKey));

  await Promise.allSettled(openFilePromises);

  if(FileManager.activeFilePath === null && Object.keys(FileManager.files).length > 0)
    EditorManager.showFileInEmptyEditors(Object.keys(FileManager.files)[0]);
  
}

class Storage{
  static #buffer = {};
  static async saveFileKeys(){
    let fileObject = {};
    for(const fileKey in FileManager.files)
      fileObject[fileKey] = FileManager.files[fileKey].toSerelizedObject();

    await Neutralino.storage.setData("files", JSON.stringify(fileObject));
  }
  static async saveEditorKeys(){
    let editorObject = {};
    for(const editorKey in EditorManager.editors)
      editorObject[editorKey] = EditorManager.editors[editorKey].toSerelizedObject();

    await Neutralino.storage.setData("editors", JSON.stringify(editorObject));
  }
  static async saveAdditionalInfo(){
    const additionalInfo = {
      splitViewType: userPreferences.splitViewType,
      additionalFileInfo: FileManager.additionalFileInfo
    };
    await Neutralino.storage.setData("additional-info", JSON.stringify(additionalInfo));
  }
  static async getAdditionalInfo(){
    try{
      return (Storage.#buffer["additional-info"]) ? Storage.#buffer["additional-info"] : Storage.#buffer["additional-info"] = JSON.parse(await Neutralino.storage.getData("additional-info"));
    }
    catch{}
  }
  static async getFileKeys(){
    try{
      return (Storage.#buffer["files"]) ? Storage.#buffer["files"] : Storage.#buffer["files"] = JSON.parse(await Neutralino.storage.getData("files"));
    }catch{
      return {};
    }
  }
  static async getEditorKeys(){
    try{
      return (Storage.#buffer["editors"]) ? Storage.#buffer["editors"] : Storage.#buffer["editors"] = JSON.parse(await Neutralino.storage.getData("editors"));
    }catch{
      return {};
    }
  }
  static async saveLastFileKeys(){
    let fileObject;

    if(Object.keys(FileManager.files).length > 5)
      fileObject = {};
    else
      fileObject = await Storage.getLastFileKeys();

    if(Object.keys(fileObject).length >= 15)
      fileObject = {};
    
    for(const fileKey in FileManager.files)
      fileObject[fileKey] = FileManager.files[fileKey].toSerelizedObject();

    await Neutralino.storage.setData("last-files", JSON.stringify(fileObject));
  }
  static async getLastFileKeys(){
    try{
      return (Storage.#buffer["last-files"]) ? Storage.#buffer["last-files"] : Storage.#buffer["last-files"] = JSON.parse(await Neutralino.storage.getData("last-files"));
    }catch{
      return {};
    }
  }
}