export default function(extName){
  switch (extName){
    case "c":
    case "h":
      return "C";
    case "cpp":
    case "hpp":
      return "C++";
    case "cs":
      return "C#";
    case "css":
      return "CSS";
    case "cjs":
    case "mjs":
      return "Node JS";
    case "html":
    case "htm":
      return "HTML";
    case "java":
    case "jar":
      return "Java";
    case "js":
      return "JavaScript";
    case "json":
      return "JSON";
    case "jsx":
      return "JavaScript & XML";
    case "gitattributes":
    case "gitignore":
      return "Git files";
    case "md":
      return "Markdown";
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
    case "svg":
      return "SVG";
    case "sql":
      return "SQL";
    case "ts":
      return "TypeScript";
    case "tsx":
      return "Typescript & XML";
    case "txt":
      return "Text";
    case "xml":
      return "XML";
    default:
      return null;
  }
}