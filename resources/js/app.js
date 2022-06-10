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
      "createSplitView-fluent-button",
      "exitSplitView-fluent-button",
      "saveAllFiles-fluent-button",
      "closeAllFiles-fluent-button",
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
      "createSplitView-fluent-button",
      "exitSplitView-fluent-button",
      "saveAllFiles-fluent-button",
      "closeAllFiles-fluent-button",
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
}

class Keybindings{
  static #actions = {
    "createSplitView": async function(){createSplitView();},
    "exitSplitView": async function(){exitSplitView();},
    "uploadFile": async function(){uploadFile();},
    "createNewFile": async function(){createNewFile();},
    "uploadFolder": async function(){uploadFolder();},
    "saveFile": async function(){FileManager.saveFile(FileManager.activeFilePath);},
    "saveAllFiles": async function(){FileManager.saveAllFiles();},
    "openSettings": async function(){showSettingsMain();}
  };
  static async executeKeybindingEvent(event){
    if(!event instanceof KeyboardEvent)
      return;

    const validKeybindings = Object.keys(settings.settings.keybindings).filter(function(keybinding){
      if(keybinding.split("-").includes(event.key.toUpperCase()) === true)
        return keybinding;
    }).filter(function(keybinding){
      if(event.ctrlKey === keybinding.split("-").includes("Ctrl"))
        return keybinding;
    }).filter(function(keybinding){
      if(event.shiftKey === keybinding.split("-").includes("Shift"))
        return keybinding;
    });

    if(validKeybindings.length > 0){
      event.preventDefault();
      for(const validKeybinding of validKeybindings){
        if(Object.keys(Keybindings.#actions).includes(settings.settings.keybindings[validKeybinding]))
          Keybindings.#actions[settings.settings.keybindings[validKeybinding]]();
      }
    }
    
  }
  static async setListener(){
    window.addEventListener("keyup", Keybindings.executeKeybindingEvent);
  }
  static async removeListener(){
    window.removeEventListener("keyup", Keybindings.executeKeybindingEvent);
  }
}