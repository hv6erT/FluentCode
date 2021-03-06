export default class Css {
  static async insertCSS(cssText){
    if(!cssText || typeof cssText !== "string")
      throw new Error("Param cssText must be instanceof string");
    const style = document.createElement('style');
    style.innerHTML = cssText;
    document.head.appendChild(style);
  }
  static async setCSSVariable(property, value, media) {
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
  static async getCSSVariable(property) {
    if(!property)
      throw new Error("Invalid property param");
    if (!property.startsWith("--"))
      property = "--" + property;
    return getComputedStyle(document.documentElement).getPropertyValue(property);
  }
}