import {StandardLuminance, baseLayerLuminance} from "./bundles/fluentWebComponents.js";

Neutralino.events.on("colorReady", async function(){
  if(userPreferences.colorMode === "dark")
    baseLayerLuminance.setValueFor(document.body, StandardLuminance.DarkMode);
  else
    baseLayerLuminance.setValueFor(document.body, StandardLuminance.LightMode);
});