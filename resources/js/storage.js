"use strict";

const openFilesAndEditorsFromStorage = async () => {
  const fileObject = await Storage.getFileKeys();
  const editorObject = await Storage.getEditorKeys();

  const openFilePromises = {};
  for(const filePath in fileObject)
    openFilePromises[filePath] = FileManager.openFile(filePath);
  
  for(const editorKey in editorObject){
    if(editorKey != 0)
      await EditorManager.openEditor(editorKey);

    const fileObjectToShow = editorObject[editorKey].active;
    
    if(fileObjectToShow){
      for(const filePath in fileObject){
        if(JSON.stringify(fileObject[filePath]) === JSON.stringify(fileObjectToShow)){
          await openFilePromises[filePath];
          EditorManager.showFileInEditor(editorKey, filePath);
          continue;
        }
      }
    }
    else{
      await Promise.allSettled(Object.values(openFilePromises));
      if(FileManager.files.length > 0)
        EditorManager.showFileInEditor(editorKey, Object.keys(FileManager.files)[0]);
    }
  }
  setSplitView((await Storage.getSplitViewType()) ?? Object.keys(EditorManager.editors).length.toString());
}

const openLastFilesFromStorage = async () => {
  const fileObject = await Storage.getLastFileKeys();

  const openFilePromises = [];
  for(const fileKey in fileObject)
    openFilePromises.push(FileManager.openFile(fileKey));

  await Promise.allSettled(openFilePromises);

  if(FileManager.activeFilePath === null && Object.keys(FileManager.files).length > 0)
    await EditorManager.showFileInEditor(EditorManager.activeEditorName, Object.keys(FileManager.files)[0]);
}

class Storage{
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
  static async saveSplitViewType(){
    await Neutralino.storage.setData("splitViewType", userPreferences.splitViewType);
  }
  static async getSplitViewType(){
    try{
      return await Neutralino.storage.getData("splitViewType")
    }
    catch{}
  }
  static async getFileKeys(){
    try{
      return JSON.parse(await Neutralino.storage.getData("files"));
    }catch{
      return {};
    }
  }
  static async getEditorKeys(){
    try{
      return JSON.parse(await Neutralino.storage.getData("editors"));
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
      return JSON.parse(await Neutralino.storage.getData("last-files"));
    }catch{
      return {};
    }
  }
}