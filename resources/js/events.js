window.addEventListener("DOMContentLoaded", async function() {
  for(const fluentMenuItem of document.getElementsByTagName("fluent-menu-item"))
    fluentMenuItem.addEventListener("mousedown", event => event.preventDefault());
  
  document.getElementById("settingsInfoAppVersion-div").innerText = NL_APPVERSION;
});

Neutralino.events.on("settingsReady", async function(){
  await EditorManager.openEditor();
  showContentMain();
  await openFilesAndEditorsFromStorage();

  if(NL_ARGS.length > 1){
    const filePath = normalizePath(NL_ARGS[1]);
    await FileManager.openFile(filePath);
    EditorManager.showFileInEditor(EditorManager.activeEditorName, filePath);
  }

  settings.applySettingsToDOM();
  settings.applySettingsDOMListeners();

  if(settings.settings.editor["controls-titles"] === false)
    Css.insertCSS(`[data-tooltip="title"]{ display: none !important;}`);

  await FileManager.startAutoSave();
});

window.addEventListener("load", async function() {
  Keybindings.setListener();    
});

Neutralino.events.on("windowFocus", async function (){
  try{await FileManager.startAutoSave();}catch{}
});

Neutralino.events.on("windowBlur", async function () {
  try{await FileManager.stopAutoSave();}catch{}
});

Neutralino.events.on("serverOffline", async function(){
  const errorResponse = await Neutralino.os.showMessageBox("Error: App is not responding", "Try to restart app", "RETRY_CANCEL", "ERROR");

  if(errorResponse === "RETRY")
    Neutralino.app.restartProcess();
});

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
    try{await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(settings.userSettings, "", 4));}catch(error){
      const settingsSaveConfirmResponse = await Neutralino.os.showMessageBox("Error: Settings could not be saved", `Settings could not be saved, do you want to close anyway? \n Error message: "${error.message}"`, "YES_NO", "ERROR");

      if(settingsSaveConfirmResponse === "NO")
        return;
    }

  await Promise.allSettled([Storage.saveFileKeys(), Storage.saveEditorKeys(), Storage.saveLastFileKeys()]);

  if(NL_OS !== "Darwin")
    await Neutralino.app.exit();
});

window.keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}