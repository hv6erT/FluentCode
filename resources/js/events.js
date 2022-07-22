"use strict";

NL_LOADING_TIME = Date.now();
 
Neutralino.events.on("themeReady", async function(){
  App.showLoader();
  
  await Neutralino.window.focus();
});

Neutralino.events.on("settingsReady", async function(){
  await EditorManager.openEditor();

  const openFilesPromises = [];

  if(settings.settings.file["auto-restore-files"] === true)
    openFilesPromises.push(openFilesAndEditorsFromStorage().catch(function(error){console.error(error);}));

  NL_LOADED.push("STORAGE");

  openFilesPromises.push(openFilesFromAppArgs());

  await Promise.allSettled(openFilesPromises);

  if(Object.keys(FileManager.files).length === 0)
    App.showStartPage();
  
  App.showContent();
  
  NL_LOADING_TIME = Date.now() - NL_LOADING_TIME;

  Neutralino.debug.log(`Total loading time: ${NL_LOADING_TIME} ms`);
    
  FileManager.startAutoSave();
});

window.addEventListener("DOMContentLoaded", async function() {
  restoreWindowStateFromStorage();
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
  if(window.settings === null || typeof window.settings === "undefined" || typeof EditorManager === "undefined" || typeof FileManager === "undefined" || typeof FileNav === "undefined" || typeof Storage === "undefined")
    await Neutralino.app.killProcess();
  else
    App.close("EXIT");
});