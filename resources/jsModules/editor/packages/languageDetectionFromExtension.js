export default function(extName){
  switch (extName){
    case "html":
    case "htm":
      return "HTML";
    case "xml":
      return "XML";
    case "css":
      return "CSS";
    case "java":
    case "jar":
      return "Java";
    case "js":
    case "mjs":
    case "cjs":
      return "JavaScript";
    case "json":
      return "JSON";
    case "jsx":
      return "JavaScript & XML";
    case "c":
    case "h":
      return "C";
    case "cpp":
    case "hpp":
      return "C++";
    case "cs":
      return "C#";
    case "lua":
      return "Lua";
    case "php":
      return "PHP";
    case "py": 
    case "py3": 
    case "pyw":
      return "Python";
    case "rs":
      return "Rust";
    case "ts":
      return "TypeScript";
    case "tsx":
      return "Typescript & XML";
    case "txt":
      return "Text";
    case "md":
      return "Markdown";
    case "svg":
      return "SVG";
    case "sql":
      return "SQL";
    default:
      return null;
  }
}