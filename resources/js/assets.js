import {baseLayerLuminance} from "./bundles/fluentWebComponents.js";

const setColorOnAssets = async () => {
  if(userPreferences.colorMode === "dark"){
    baseLayerLuminance.setValueFor(document.body, 0.15);
    baseLayerLuminance.setValueFor(document.getElementById("topNav-fluent-toolbar"), 0.20);
  }
  else{
    baseLayerLuminance.setValueFor(document.body, 0.95);
    baseLayerLuminance.setValueFor(document.getElementById("topNav-fluent-toolbar"), 1);
  }
}

if(NL_LOADED.includes("COLOR") === true)
  setColorOnAssets();

Neutralino.events.on("colorReady", setColorOnAssets);