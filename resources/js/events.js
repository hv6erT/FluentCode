window.addEventListener("DOMContentLoaded", async function() {
  for(const fluentMenuItem of document.getElementsByTagName("fluent-menu-item"))
    fluentMenuItem.addEventListener("mousedown", event => event.preventDefault());
  
  document.getElementById("settingsInfoAppVersion-div").innerText = NL_APPVERSION;
});

Neutralino.events.on("settingsReady", async function(){
  await EditorManager.openEditor();
  showContentMain();
  await openFilesAndEditorsFromStorage();
  await openFilesFromAppArgs();

  settings.applySettingsToDOM();
  settings.applySettingsDOMListeners();

  if(settings.settings.editor["controls-titles"] === false)
    Css.insertCSS(`[data-tooltip="title"]{ display: none !important;}`);

  FileManager.startAutoSave();

  if(settings.settings.app["auto-update"] === true){    
    try {
      const manifest = await Neutralino.updater.checkForUpdates(userPreferences.updateManifestURL);
      
      if(parseInt(manifest.version.replaceAll(".", "")) > parseInt(NL_APPVERSION.replaceAll(".", ""))) {
        await Neutralino.updater.install();
        Neutralino.os.showNotification("Updated successfully", "Restart app to see what is new!", "INFO");
        showBottomNavNotification("Updated successfully", 5000);
      }
    }
    catch(error) {
      if(error.code !== "NE_UP_CUPDERR"){
        Neutralino.os.showNotification("Update failed", "Cannot update to newer version", "ERROR");
        showBottomNavNotification("Update failed", 7000);
      }
    }
  }
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

Neutralino.events.on("windowClose", async function(options) {
  const defaultOptions = {
    closeType: "EXIT" // EXIT || RESTART
  };

  options = {...defaultOptions, ...(options.detail ?? {})};
  
  if(settings.settings.file["save-before-close"] === true)
    saveAllFilesBeforeClose();    
  else{
    const questionResponse = await Neutralino.os.showMessageBox("Unsaved changes", `Do you want to save your work?`, "YES_NO_CANCEL", "QUESTION");

    if(questionResponse === "YES")
      saveAllFilesBeforeClose();
    else if(questionResponse === "CANCEL")
      return;
  }

  if(settings.hasChanged() === true)
    try{await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(settings.userSettings, "", 4));}catch(error){
      const settingsSaveConfirmResponse = await Neutralino.os.showMessageBox("Error: Settings could not be saved", `Settings could not be saved, do you want to close anyway? \n Error message: "${error.message}"`, "YES_NO", "ERROR");

      if(settingsSaveConfirmResponse === "NO")
        return;
    }

  await Promise.allSettled([Storage.saveFileKeys(), Storage.saveEditorKeys(), Storage.saveLastFileKeys()]);
  
  if(options.closeType === "EXIT"){
    if(NL_OS !== "Darwin")
      await Neutralino.app.exit();
  }
  else if(options.closeType === "RESTART"){
    await Neutralino.app.restartProcess();
  }
  else 
    throw new Error("Unknown closeType option");
});

window.keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}