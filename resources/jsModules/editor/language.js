const ignoreAutocompleteIn = ["TemplateString", "LineComment", "BlockComment", "VariableDefinition", "PropertyDefinition"];

import {ifNotIn} from "./codemirror.js";

import languageDetectionFromExtension from "./packages/languageDetectionFromExtension.js";

export default class Language{
  static detectLanguageFromExtension = languageDetectionFromExtension;
  static async autocompleteFromLanguageName(langName){
    if (!langName)
      return null;
      
    langName = langName.toLowerCase();
    let autocompletion;
    switch(langName){
      case "html":
        const htmlLanguage = (await import("./codemirror.js")).htmlLanguage;
        const htmlCompletion = (await import("./codemirror.js")).htmlCompletion;
        autocompletion = htmlLanguage.data.of({
          autocomplete: ifNotIn(ignoreAutocompleteIn, htmlCompletion)
        });
        break;
      case "css":
        const cssLanguage = (await import("./codemirror.js")).cssLanguage;
        const cssCompletion = ((await import("./codemirror.js"))).cssCompletion;
        autocompletion = cssLanguage.data.of({
          autocomplete: ifNotIn(ignoreAutocompleteIn, cssCompletion)
        });
        break;
      case "javascript":
      	const javascriptLanguage = (await import("./codemirror.js")).javascriptLanguage;
      	const javascriptCompletion = await import("./packages/JSCompletion.js");
        autocompletion = javascriptLanguage.data.of({
          autocomplete: ifNotIn(ignoreAutocompleteIn, javascriptCompletion)
        });
        break;
      case "c":
      case "c++":
      	const cppLanguage = (await import("./codemirror.js")).cppLanguage;
      	const cppCompletion = await import("./packages/CPPCompletion.js");
        autocompletion = cppLanguage.data.of({
          autocomplete: ifNotIn(ignoreAutocompleteIn, cppCompletion)
        });
        break;
    }
    return autocompletion;
  }
  static async languageSupportFromLanguageName(langName){
    if (!langName)
      return null;
    
    langName = langName.toLowerCase();
    let langSupport;
    switch(langName){
      case "html":
        langSupport = (await import("./codemirror.js")).html();
        break;
      case "css":
        langSupport = (await import("./codemirror.js")).css();
        break;
      case "javascript":
        langSupport = (await import("./codemirror.js")).javascript();
        break;
      case "javascript & xml": 
        langSupport = (await import("./codemirror.js")).javascript({jsx: true});
          break;
      case "typescript":
        langSupport = (await import("./codemirror.js")).javascript({typescript: true});
        break;
      case "json":
        langSupport = (await import("./codemirror.js")).json();
        break;
      case "java":
        langSupport = (await import("./codemirror.js")).java();
        break;
      case "php":
        langSupport = (await import("./codemirror.js")).php();
        break;
      case "rust": 
        langSupport = (await import("./codemirror.js")).rust();
        break;
      case "c":
      case "c++":
        langSupport = (await import("./codemirror.js")).cpp();
        break;
      case "xml":
      case "svg":
        langSupport = (await import("./codemirror.js")).xml();
        break;
    }
    return langSupport;
  }
  static async autocompleteAnyWordFromLanguageName(langName){
    if (!langName)
      return null;
    
    langName = langName.toLowerCase();
    let autocompletion;
    const completeAnyWord = (await import("./codemirror.js")).completeAnyWord;
    switch(langName){
      case "html":
        const htmlLanguage = (await import("./codemirror.js")).htmlLanguage;
        autocompletion = htmlLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "css":
        const cssLanguage = (await import("./codemirror.js")).cssLanguage;
        autocompletion = cssLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "javascript":
      	const javascriptLanguage = (await import("./codemirror.js")).javascriptLanguage;
        autocompletion = javascriptLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "typescript":
        const typescriptLanguage = (await import("./codemirror.js")).typescriptLanguage;
        autocompletion = typescriptLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "json":
        const jsonLanguage = (await import("./codemirror.js")).jsonLanguage;
        autocompletion = jsonLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "java":
      	const javaLanguage = (await import("./codemirror.js")).javaLanguage;
        autocompletion = javaLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "php": 
        const phpLanguage = (await import("./codemirror.js")).phpLanguage;
        autocompletion = phpLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "rust":
        const rustLanguage = (await import("./codemirror.js")).rustLanguage;
        autocompletion = rustLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
      case "c":
      case "c++":
        const cppLanguage = (await import("./codemirror.js")).cppLanguage;
        autocompletion = cppLanguage.data.of({
          autocomplete: completeAnyWord
        });
        break;
    }
    return autocompletion;
  }
}