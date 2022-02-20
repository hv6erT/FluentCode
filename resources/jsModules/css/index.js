export default class Css {
  static insertCSS(cssText){
    if(!cssText || typeof cssText !== "string")
      throw new Error("Param cssText must be instanceof string");
    const style = document.createElement('style');
    style.innerHTML = cssText;
    document.head.appendChild(style);
  }
  static setCSSVariable(property, value, media) {
    if(!property || !value)
      throw new Error("Invalid params value");
    if (!property.startsWith("--"))
      	property = "--" + property;
    if(!media)
      document.documentElement.style.setProperty(property, value);
    else{
      const cssText = `@media ${media} {
        :root{${property}: ${value};}}`;
      Css.insertCSS(cssText);
    }
  }
  static getCSSVariable(property) {
    if(!property)
      throw new Error("Invalid property param");
    if (!property.startsWith("--"))
      property = "--" + property;
    return getComputedStyle(document.documentElement).getPropertyValue(property);
  }
  static changeColorSchame(colorSchame){
    if(colorSchame === "system" || colorSchame === "normal"){
      document.documentElement.style.colorScheme = "normal";
    }
    else if(colorSchame === "light")
      document.documentElement.style.colorScheme = "light dark";
    else if(colorSchame === "dark")
      document.documentElement.style.colorScheme = "dark light";
    else
      throw new Error("Invalid colorSchame param value");
  }
}