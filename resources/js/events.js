"use strict";
 
Neutralino.events.on("themeReady", async function(){
  App.showContent();
});

Neutralino.events.on("settingsReady", async function(){
  await EditorManager.openEditor();

  if(settings.settings.file["auto-restore-files"] === true)
    try{await openFilesAndEditorsFromStorage();}catch(error){console.error(error);}

  NL_LOADED.push("STORAGE");

  openFilesFromAppArgs();
      
  settings.applySettingsToDOM();
  settings.applySettingsDOMListeners();
    
  FileManager.startAutoSave();
});

window.addEventListener("DOMContentLoaded", async function() {
  App.showStartPage();
  
  App.appInfo();
});
    
window.addEventListener("load", async function() {
  Keybindings.setListener();

  setTimeout(async function(){
    if(!["SETTINGS", "COLOR", "THEME", "STORAGE"].every(module => NL_LOADED.includes(module)))
      Neutralino.app.restartProcess();
  }, 5000);
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
  if(window.settings === null || typeof window.settings === "undefined" || typeof EditorManager === "undefined" || typeof FileManager === "undefined" || typeof FileNav === "undefined" || typeof Storage === "undefined")
    await Neutralino.app.killProcess();
  else
    App.close("EXIT");
});

window.keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}