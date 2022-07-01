import {baseLayerLuminance} from "./bundles/fluentWebComponents.js";

const setColorOnAssets = async () => {
  if(userPreferences.colorMode === "dark"){
    baseLayerLuminance.setValueFor(document.body, 0.15);
    baseLayerLuminance.setValueFor(document.getElementById("topAppPanel-nav"), 0.20);
    baseLayerLuminance.setValueFor(document.getElementById("topSettingsPanel-nav"), 0.20);
  }
  else{
    baseLayerLuminance.setValueFor(document.body, 0.95);
    baseLayerLuminance.setValueFor(document.getElementById("topAppPanel-nav"), 1);
    baseLayerLuminance.setValueFor(document.getElementById("topSettingsPanel-nav"), 1);
  }
}

if(NL_LOADED.includes("COLOR") === true)
  setColorOnAssets();

Neutralino.events.on("colorReady", setColorOnAssets);