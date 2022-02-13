const openFilesAndEditorsFromStorage = async () => {
  const fileObject = await Storage.getFileKeys();
  const editorObject = await Storage.getEditorKeys();

  for(const fileKey in fileObject)
    await FileManager.openFile(fileKey);
  
  for(const editorKey in editorObject){
    if(editorKey != 0)
      await EditorManager.openEditor(editorKey);

    const fileObjectToShow = editorObject[editorKey].active;
    if(fileObjectToShow){
      for(const filePath in FileManager.files){
        if(FileManager.files[filePath].toJSON() === JSON.stringify(fileObjectToShow)){
          await EditorManager.showFileInEditor(editorKey, filePath);
          return;
        }
      }
    }
    
    await EditorManager.showFileInEditor(editorKey, Object.keys(FileManager.files)[0]);
  }
}

const openLastFilesFromStorage = async () => {
  const fileObject = await Storage.getLastFileKeys();

  for(const fileKey in fileObject)
    await FileManager.openFile(fileKey);

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