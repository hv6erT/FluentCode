import {StandardLuminance, baseLayerLuminance} from "./bundles/fluentWebComponents.js";

const setColorOnAssets = async () => {
  if(userPreferences.colorMode === "dark")
    baseLayerLuminance.setValueFor(document.body, StandardLuminance.DarkMode);
  else
    baseLayerLuminance.setValueFor(document.body, StandardLuminance.LightMode);
}

if(NL_LOADED.includes("COLOR") === true)
  setColorOnAssets();
else
  Neutralino.events.on("colorReady", setColorOnAssets);