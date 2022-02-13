import deepMerge from "./deepmerge.js";
import deepEqual from "./deepequal.js";

function serelizeArguments(item) {
  if(typeof item === "string"){
    if (item.includes("{") || item.includes("["))
      try {item = JSON.parse(item);} catch {}
  }
  return item;
}

export default class Settings {
  constructor(defaultSettings, userSettings) {
    Object.defineProperty(this, "defaultSettings", {
      writable: false,
      value: defaultSettings
    });

    this.userSettings = userSettings;

    try {
      Object.defineProperty(this, "settings", {
        writable: false,
        value: deepMerge(defaultSettings, userSettings)
      });
    } catch{}
  }
  changeSettings(keysArray, newValue) {
	keysArray = serelizeArguments(keysArray);
    
    if (Array.isArray(keysArray) === false)
      keysArray = [keysArray];
    
    let current = this.userSettings;
     
    while ( keysArray.length > 1 ) {
      const property = keysArray.shift();
         
      if ( current[ property ] === undefined ) {
        current[ property ] = {};
      }
      current = current[ property ];
    }
    current[ keysArray.shift() ] = newValue;
  }
  changeSettingsToDefault() {
    this.userSettings = {};
  }
  getActiveSettingsValue(){
    return deepMerge(this.defaultSettings, this.userSettings);
  }
  getActiveSettingsPropertyValue(keysArray){
    keysArray = serelizeArguments(keysArray);
    if (Array.isArray(keysArray)==false)
      keysArray=[keysArray];

    let current = deepMerge(this.defaultSettings, this.userSettings);

    for (const key of keysArray) 
      current = current[key];

    return current;
  }
  hasChanged(){
    return !deepEqual(this.settings, this.getActiveSettingsValue());
  }
  async applySettingsToDOM() {
    if(!document)
      throw new Error("SettingsInstance.applySettingsToDOM need DOM");
    
    const settingNodes = document.querySelectorAll(`[data-settings]`);
    
    for (const node of settingNodes) {
      const value = this.getActiveSettingsPropertyValue(node.getAttribute("data-settings"));
      if (node.type === "radio" || node.type === "checkbox" || node.getAttribute("data-settings-type") === "radio" || node.getAttribute("data-settings-type") === "checkbox")
        node.checked = value;
      else
        node.value = value;
    }
  }
  async applySettingsDOMListeners() {
    if(!document)
      throw new Error("SettingsInstance.applySettingsDOMListeners need DOM");

    const settingNodes = document.querySelectorAll(`[data-settings]`);
    for (const node of settingNodes) {
      const self = this;
      node.addEventListener("change", async function(){
        if (node.type === "radio" || node.type === "checkbox" || node.getAttribute("data-settings-type") === "radio" || node.getAttribute("data-settings-type") === "checkbox")
          self.changeSettings(node.getAttribute("data-settings"), node.checked);
        else
          self.changeSettings(node.getAttribute("data-settings"), node.value);
      });
    }
  }
  toSerelizedObject() {
    return {
      defaultSettings: this.defaultSettings,
      userSettings: this.userSettings,
      settings: this.settings
    };
  }
  toJSON() {
    return JSON.stringify(this.toSerelizedObject());
  }
  static fromJSON(json) {
    if(typeof json !== "string")
      throw new Error("First param need to be an json string");
    else if(!json.defaultSettings || !json.userSettings)
      throw new Error("Invalid json form of Settings");

    const serelizedSettings = JSON.parse(json);
    
    return new Settings(serelizedSettings.defaultSettings, serelizedSettings.userSettings);
  }
}