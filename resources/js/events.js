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
    await FileManager.saveAllFiles();

  if(settings.hasChanged() === true)
    await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(settings.userSettings));

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