class Keybindings{
  static #actions = {
    "createSplitView": async function(){createSplitView();},
    "exitSplitView": async function(){exitSplitView();},
    "uploadFile": async function(){uploadFile();},
    "createNewFile": async function(){createNewFile();},
    "uploadFolder": async function(){uploadFolder();},
    "saveFile": async function(){FileManager.saveFile(FileManager.activeFilePath);},
    "saveAllFiles": async function(){FileManager.saveAllFiles();},
    "openSettings": async function(){modifyNodeAttribute('#settings-fluent-dialog', 'hidden', false);}
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