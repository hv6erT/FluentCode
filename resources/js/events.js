window.addEventListener("DOMContentLoaded", async function() {
  for(const fluentMenuItem of document.getElementsByTagName("fluent-menu-item"))
    fluentMenuItem.addEventListener("mousedown", event => event.preventDefault());
  
  document.getElementById("settingsInfoAppVersion-div").innerText = NL_APPVERSION;
});

window.addEventListener("mainReady", async function(){
  await EditorManager.openEditor();
  await openFilesAndEditorsFromStorage();
  showContentMain();

  settings.applySettingsToDOM();
  settings.applySettingsDOMListeners();

  await FileManager.startAutoSave();
});

window.addEventListener("load", async function() {
  Keybindings.setListener();
});

window.addEventListener("focus", async function (){
  try{await FileManager.startAutoSave();}catch{}
});

window.addEventListener("blur", async function () {
  try{await FileManager.stopAutoSave();}catch{}
})

Neutralino.events.on("windowClose", async function() {
  if(settings.settings.file["save-before-close"] === true)
    try{await FileManager.saveAllFiles();}catch(error){
      const errorResponse = await Neutralino.os.showMessageBox("Error: Files could not be saved", `Error message: "${error.message}"`, "ABORT_RETRY_IGNORE", "ERROR");

      if(errorResponse === "ABORT"){
        const savingConfirmResponse = await Neutralino.os.showMessageBox("Confirm close without save", `Are you sure you want to close Fluent Code? Your work and other changes would not be saved."`, "YES_NO", "QUESTION");

        if(savingConfirmResponse === "YES")
          await Neutralino.app.exit();
        else return;
      }
      else if(errorResponse === "RETRY")
        return Neutralino.events.dispatch("windowClose");
    }

  if(settings.hasChanged() === true)
    try{await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(settings.userSettings));}catch(error){
      const settingsSaveConfirmResponse = await Neutralino.os.showMessageBox("Error: Settings could not be saved", `Settings could not be saved, do you want to close anyway? \n Error message: "${error.message}"`, "YES_NO", "ERROR");

      if(settingsSaveConfirmResponse === "NO")
        return;
    }

  try{
    await Storage.saveFileKeys();
    await Storage.saveEditorKeys();
    await Storage.saveLastFileKeys();
  }catch{}
    
  await Neutralino.app.exit();
});

const keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}