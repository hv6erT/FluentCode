window.addEventListener("DOMContentLoaded", async function() {
  document.getElementById("settingsInfoAppVersion-div").innerText = NL_APPVERSION;
});

window.addEventListener("DOMContentLoaded", async function(){
  await EditorManager.openEditor();
  await openFilesAndEditorsFromStorage();

  settings.applySettingsToDOM();
  settings.applySettingsDOMListeners();

  FileManager.startAutoSave();
  
  showContentMain();
});

window.addEventListener("load", function() {
  Keybindings.setListener();
});

window.addEventListener("focus", async function (){
  await FileManager.startAutoSave();
});

window.addEventListener("blur", async function () {
  await FileManager.stopAutoSave();
})

Neutralino.events.on("windowClose", async function() {
  if(settings.settings.file["save-before-close"] === true)
    await FileManager.saveAllFiles();

  if(settings.hasChanged() === true)
    await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(settings.userSettings));
  
  await Storage.saveFileKeys();
  await Storage.saveEditorKeys();
  await Storage.saveLastFileKeys();
    
  await Neutralino.app.exit();
});

const keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}