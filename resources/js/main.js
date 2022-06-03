"use-strict";

Neutralino.init();

//global scope functions and vars
window.normalizePath = (filePath) => {
  if (typeof filePath === "string")
    return filePath.replace(/^\\\\\?\\/,"").replace(/\\/g,'\/').replace(/\/\/+/g,'\/');
  else throw new Error("Invalid argument type, normalizePath requires string as param");
}

window.File = null;
window.Editor = null;
window.Css = (await import("../jsModules/css/index.js")).default;
window.settings = null;
window.userPreferences = {
  colorMode: null,
  settingsFilePath: normalizePath(await Neutralino.os.getPath("documents")) + "/FluentCode/settings.json",
  updateManifestURL: "https://raw.githubusercontent.com/hv6erT/FluentCode/main/dist/update.json"
};

//other functions
import Settings from "../jsModules/settings/index.js";

const setSettings = async () => {
  let defaultSettings, userSettings;
  defaultSettings = {
    "mode": "system",
    "modes": {
      "light-mode": {
        "theme": "../jsModules/theme/webidea-light.js",
        "highlight": "../jsModules/highlight/atom-one-light.js",
        "accent-bg-color": "#ffffff",
        "first-bg-color": "#ffffff",
        "second-bg-color": "#fbfbfb",
        "third-bg-color": "#e6e6e6",
        "basic-color": "#1a1a1a",
        "scrollbar-color": "#78909C",
        "nav-width": "230px"
      },
      "dark-mode": {
        "theme": "../jsModules/theme/webidea-dark.js",
        "highlight": "../jsModules/highlight/atom-one-dark.js",
        "accent-bg-color": "#201f1e",
        "first-bg-color": "#191919",
        "second-bg-color": "#272727",
        "third-bg-color": "#393939",
        "basic-color": "#ffffff",
        "scrollbar-color": "#9E9E9E",
        "nav-width": "230px"
      },
    },
    "app": {
      "auto-update": true
    },
    "editor": {
      "font-size": 13,
      "line-wrapping": false,
      "tab-size": 4,
      "color-preview": true,
      "progress-bar": false,
      "selection-tooltip": false,
      "language-autocompletion": true,
      "any-word-autocompletion": true
    }, 
    "file": {
      "auto-save": true,
      "auto-save-time": 60000,
      "save-before-close": true,
      "templates": true
    },
    "keybindings": {
      "Ctrl-F": "uploadFile",
      "Ctrl-N": "createNewFile",
      "Ctrl-D": "uploadFolder",
      "Ctrl-S": "saveAllFiles",
      "Ctrl-\\": "createSplitView",
      "Ctrl-\/": "exitSplitView",
      "Ctrl-I": "openSettings"
    }
  };
  
  try{
    userSettings = JSON.parse(await Neutralino.filesystem.readFile(userPreferences.settingsFilePath))
  }catch(error){
    userSettings = {};
    try{await Neutralino.filesystem.createDirectory(userPreferences.settingsFilePath.slice(0, userPreferences.settingsFilePath.lastIndexOf("/")));}catch{}
    await Neutralino.filesystem.writeFile(userPreferences.settingsFilePath, JSON.stringify(userSettings));
  }

  window.settings = new Settings(defaultSettings, userSettings);
}

const setColorMode = async () => {
  if(settings.settings.mode === "light" || settings.settings.mode === "dark")
    userPreferences.colorMode = settings.settings.mode;
  else
    userPreferences.colorMode = (window.matchMedia("(prefers-color-scheme: light)").matches === true) ? "light" : "dark";
}

const setTheme = async ()=> {
  const include = ["accent-bg-color", "first-bg-color", "second-bg-color", "third-bg-color", "basic-color", "scrollbar-color"];
  const mode = userPreferences.colorMode + "-mode";
  
  for(const property of include){
    const value = settings.settings.modes[mode][property];
    Css.setCSSVariable(property, value);
  }

  Css.setCSSVariable("nav-width", `max(${settings.settings.modes[mode]["nav-width"]}, var(--nav-min-width))`);
  
  Css.changeColorSchame(userPreferences.colorMode);
}
  
(async function(){
  try{
    await setSettings();
    NL_LOADED.push("SETTINGS");
    Neutralino.events.dispatch("settingsReady");
  }catch{
    Neutralino.os.showMessageBox("Settings error", "Try to delete file Documents/FluentCode/settings.json and launch app again. If no result reinstall the program.", "OK", "ERROR");
    return;
  }

  await setColorMode();
  NL_LOADED.push("COLOR");
  Neutralino.events.dispatch("colorReady");
  
  await setTheme();
  NL_LOADED.push("THEME");
  Neutralino.events.dispatch("themeReady");

  Neutralino.events.dispatch("appReady");
})();

//global events listeners
window.addEventListener("contextmenu", async function(event) {
  event.preventDefault(); 
});

window.addEventListener("keydown", async function(event) {
  if(event.key === "f" && event.ctrlKey === true)
     event.preventDefault();
  if(event.key === "r" && event.ctrlKey === true)
     event.preventDefault();
  if(event.key === "u" && event.ctrlKey === true)
     event.preventDefault();
});

window.addEventListener("drop", async function(event) {
  event.preventDefault(); 
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", async function () {
  await setColorMode();
  await setTheme();
});