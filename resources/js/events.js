"use strict";

{
  if(NL_ARGS.includes("closeImmediately"))
    App.close();
  
  const openEditorPromise = EditorManager.openEditor();
  Neutralino.events.on("themeReady", async function(){
    App.showContent();
  });
    
  Neutralino.events.on("settingsReady", async function(){
    try{await openEditorPromise}catch{};
    await Promise.all([openFilesAndEditorsFromStorage(), openFilesFromAppArgs()]);
      
    settings.applySettingsToDOM();
    settings.applySettingsDOMListeners();
    
    FileManager.startAutoSave();
  });

  window.addEventListener("DOMContentLoaded", async function() {
    App.showStartPage();
  
    document.querySelector('[data-appInfo="version"]').textContent = NL_APPVERSION;
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
    App.close("EXIT");
  });
}

window.keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}