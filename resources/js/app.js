"use strict";

class App{
  static async showContent(){
    document.getElementById("loading-main").style.display = "none";
    document.getElementById("content-main").style.display = "";
  }
  static async showStartPage(){
    document.getElementById("editor-article").style.display = "none";
    document.getElementById("editorStartPage-article").style.display = "";
    //other nodes
    document.getElementById("bottomFileInfo-div").style.visibility = "hidden";
    document.getElementById("bottomEditorInfo-div").style.visibility = "hidden";
  
    const nodeIdList = [
      "openSplitView-fluent-button",
      "saveAllFiles-fluent-button",
      "closeAllFiles-fluent-menu-item",
      "fileProperties-fluent-button"
    ];
  
    for(const nodeId of nodeIdList)
      document.getElementById(nodeId).disabled = true;
  }
  static async showEditorPage(){
    document.getElementById("editorStartPage-article").style.display = "none";
    document.getElementById("editor-article").style.display = "";
    //other nodes
    document.getElementById("bottomFileInfo-div").style.visibility = "";
    document.getElementById("bottomEditorInfo-div").style.visibility = "";
  
    const nodeIdList = [
      "openSplitView-fluent-button",
      "saveAllFiles-fluent-button",
      "closeAllFiles-fluent-menu-item",
      "fileProperties-fluent-button"
    ];
  
    for(const nodeId of nodeIdList)
      document.getElementById(nodeId).disabled = false;
  }
  static async changeSettingsToDefault(){
    if(!window.settings)
      throw new Error("Settings has not been loaded");
    
    settings.changeSettingsToDefault();
    App.showBottomNotification('Settings has been changed to default', 5000);
  }
  static async showBottomNotification(message, time = 5000){
    const node = document.getElementById("bottomShortInfo-span");

    node.textContent = message;
  
    if(typeof time === "number"){
      setTimeout(async function(){
        if(node.textContent === message)
          node.textContent = "";
      }, time);
    }
    else if(time !== undefined)
      throw new Error("Invalid value of time param. Param should be a Number");
  }
  static async update(restartType = "RESTART"){
    try {
      const manifest = await Neutralino.updater.checkForUpdates(userPreferences.updateManifestURL);
        
      if(parseInt(manifest.version.replaceAll(".", "")) > parseInt(NL_APPVERSION.replaceAll(".", ""))) {
        await Neutralino.updater.install();
        Neutralino.os.showNotification("Updated successfully", "Open app to see what is new!", "INFO");

        if(restartType === "EXIT")
          await Neutralino.app.restartProcess({ args: '--closeImmediately'});
        else if(restartType === "RESTART")
          await Neutralino.app.restartProcess();
        else 
          throw new Error("Unknown restartType option");
      }
    }
    catch(error) {
      if(error.code !== "NE_UP_CUPDERR"){
        Neutralino.os.showNotification("Update failed", "Cannot update to newer version", "ERROR");
      }
    }
  }
  static async close(closeType = "EXIT"){    
    Neutralino.window.hide();
    
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
  
    await Promise.allSettled([Storage.saveFileKeys(), Storage.saveEditorKeys(), Storage.saveLastFileKeys(), Storage.saveSplitViewType()]);
  
    if(settings.settings.app["auto-update"] === true && closeType === "EXIT"){
      await App.update("EXIT");
    }
    
    if(closeType === "EXIT"){
      if(NL_OS !== "Darwin")
        await Neutralino.app.exit();
    }
    else if(closeType === "RESTART"){
      await Neutralino.app.restartProcess();
    }
    else 
      throw new Error("Unknown closeType option");
  }
}