export default class Templates {
  static languageTemplateFromLangName(langName){
    if(!langName)
      throw new Error("Invalid value of lang name param");
    
    switch(langName){
      case "html": return Templates.html(); break;
      case "css": return Templates.css(); break;
      default: return ""; break;
    }
  }
  static html(){
    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body></body>
</html>`;
  }
  static css(){
    return `html, body{
  padding: 0px;
  margin: 0px;
}`;
  }
  static supportedLanguages = ["html", "css"];
}