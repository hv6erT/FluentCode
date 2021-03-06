"use strict";

const uploadFile = async () => {
  const data = await Neutralino.os.showOpenDialog("Upload file", {multiSelections: true});
  await Neutralino.window.focus();
  const filePaths = data.map(function(filePath){return toUnixPath(filePath);});

  if(filePaths.length === 0)
    return;

  let fileToShow = filePaths[(filePaths.length - 1)];
  
  for(const filePath of filePaths){
    if(FileManager.isOpened() === false)
      await FileManager.openFile(filePath);
    else fileToShow = filePath;
  }
  EditorManager.showFileInEditor(EditorManager.activeEditorName, fileToShow);
  EditorManager.showFileInEmptyEditors(fileToShow);
}

const createNewFile = async () => {
  const filePath = toUnixPath(await Neutralino.os.showSaveDialog("Create new file"));
  await Neutralino.window.focus();
  if(!filePath)
    return;
  await Neutralino.filesystem.writeFile(filePath, "");
  await FileManager.openFile(filePath);
  await EditorManager.showFileInEditor(EditorManager.activeEditorName, filePath);
  if(settings.settings.file.templates === true){
    if(window.Templates === null)
      window.Templates = (await import("../jsModules/templates/index.js")).default;

    const fileLanguage = File.getLanguageNameFromFilename(filePath).toLowerCase();
    if(Templates.supportedLanguages.includes(fileLanguage))
      EditorManager.insertText(EditorManager.activeEditorName, Templates.languageTemplateFromLangName(fileLanguage));
  }
  EditorManager.showFileInEmptyEditors(filePath);
}

const uploadFolder = async () => {
  const folderPath = toUnixPath(await Neutralino.os.showFolderDialog("Upload directory"));
  await Neutralino.window.focus();
  const filePaths = (await Neutralino.filesystem.readDirectory(folderPath)).filter(function(object){
    if(object.type === "FILE")
      return object;
  }).map(function(object){
    return toUnixPath(folderPath + "/" + object.entry);
  });
  
  if(filePaths.length === 0)
    return;

  let fileToShow = filePaths[(filePaths.length - 1)];
  
  for(const filePath of filePaths){
    if(FileManager.isOpened() === false)
      await FileManager.openFile(filePath);
    else fileToShow = filePath;
  }
  EditorManager.showFileInEditor(EditorManager.activeEditorName, fileToShow);
  EditorManager.showFileInEmptyEditors(fileToShow);
}

const openFilesFromAppArgs = async () => {
  if(NL_ARGS.length > 1){
    const filePath = toUnixPath(NL_ARGS[1]);
    
    await FileManager.openFile(filePath);
    if(FileManager.isOpened(filePath)){
      EditorManager.showFileInEditor(EditorManager.activeEditorName, filePath);
      EditorManager.showFileInEmptyEditors(filePath);
    }
  }
}

const openSettingsFile = async () => {
  await FileManager.openFile(userPreferences.settingsFilePath);
  EditorManager.showFileInEditor(EditorManager.activeEditorName, userPreferences.settingsFilePath);
  EditorManager.showFileInEmptyEditors(userPreferences.settingsFilePath);
}

const saveAllFilesBeforeClose = async function(){
  try{await FileManager.saveAllFiles();}catch(error){
    const errorResponse = await Neutralino.os.showMessageBox("Error: Files cannot be saved", `Error message: "${error.message}"`, "ABORT_RETRY_IGNORE", "ERROR");

    if(errorResponse === "IGNORE"){
      const savingConfirmResponse = await Neutralino.os.showMessageBox("Confirm to close without save", `Are you sure you want to close Fluent Code? Your changes would not be saved`, "YES_NO", "QUESTION");
        
      if(savingConfirmResponse === "NO")
        return;
    }
    else if(errorResponse === "RETRY")
      return saveAllFilesBeforeClose();
    else if(errorResponse === "ABORT")
       return;
  }
}

class FileManager {
  static files = {};
  static additionalFileInfo = {};
  static activeFilePath = null;
  static isOpened(filePath){
    return FileManager.files.hasOwnProperty(filePath);
  }
  static isInitialized(filePath){
    return FileManager.files[filePath]?.isInitialized();
  }
  static isChanged(filePath){
    return FileManager.files[filePath]?.changed;
  }
  static async canAccess(filePath){
    try {
      await Neutralino.filesystem.getStats(filePath);
    } catch{
      return false;
    }
    return true;
  }
  static async openFile(filePath){
    if(FileManager.isOpened(filePath) === true || await FileManager.canAccess(filePath) === false)
      return;

    if(window.editorThemeModules?.customTheme === null){
      const themePath = settings.settings.modes[`${userPreferences.colorMode}-mode`].theme;
      const customTheme = (await import(themePath)).default;
      if(customTheme)
        window.editorThemeModules.customTheme = customTheme;
      else
        delete window.editorThemeModules.customTheme;
    }

    if(window.editorHighlightModules?.customHighlight === null){
      const highlightPath = settings.settings.modes[`${userPreferences.colorMode}-mode`].highlight;
      const customHighlight = (await import(highlightPath)).default;

      if(customHighlight)
        window.editorHighlightModules.customHighlight = customHighlight;
      else 
        delete window.editorHighlightModules.customHighlight;
    }

    if(window.File === null)
      window.File = (await import("../jsModules/editor/file.js")).default;
    
    FileManager.files[filePath] = new File({
      panelNode: document.getElementById("top-nav-search-box"),
      theme: Object.values(window.editorThemeModules),
      highlight: Object.values(window.editorHighlightModules),
      tabSize: settings.settings.editor["tab-size"],
      tabSupport: false,
      fontSize: (settings.settings.editor["font-size"]+"px"),
      lineWrapping: settings.settings.editor["line-wrapping"],
      panelNode: document.getElementById("searchAndReplace-form"),
      progressBar: settings.settings.editor["progress-bar"],
      colorPreview: settings.settings.editor["color-preview"],
      customSelectionTooltip: false,
      customSearchPanel: 
      `
        <fluent-text-field name="search" class="margin-y" appearance="filled" placeholder="Search phrases" onclick="this.focus()" oninput="EditorManager.searchAndReplace(EditorManager.activeEditorName, {search: this.value})" onkeyup="keyboardEventActions(event, 'Enter', EditorManager.findNext)"></fluent-text-field>
        <fluent-button id="findPrevious-fluent-button" appearance="stealth" onclick="EditorManager.findPrevious();"><span class="fluent-icons-ArrowPrevious"></span></fluent-button>
        <fluent-button id="findNext-fluent-button" appearance="stealth" onclick="EditorManager.findNext();"><span class="fluent-icons-ArrowNext"></span></fluent-button>
        <div>
          <fluent-button id="searchOptions-fluent-button" appearance="stealth" onclick='toggleNodeDisplay("#searchOptions-fluent-menu"); EditorManager.searchInfo(EditorManager.activeEditorName);'><span class="fluent-icons-Filter"></span></fluent-button>
          <fluent-menu id="searchOptions-fluent-menu" class="flex flex-col padding-x padding-y gap" style="display: none;">
            <fluent-checkbox onchange="EditorManager.searchAndReplaceUsingForm(EditorManager.activeEditorName)" data-searchInfo="caseSensitive" class="padding-x">Case sensitivity</fluent-checkbox>
            <fluent-checkbox onchange="EditorManager.searchAndReplaceUsingForm(EditorManager.activeEditorName)" data-searchInfo="regexp" class="padding-x">Using regexp in search query</fluent-checkbox>
          </fluent-menu>
        </div>
        <fluent-text-field name="replace" class="margin-y" appearance="filled" placeholder="Replace words" onclick="this.focus()" oninput="EditorManager.searchAndReplace(EditorManager.activeEditorName, {replace: this.value})" onkeyup="keyboardEventActions(event, 'Enter', EditorManager.replaceNext)"></fluent-text-field>
        <fluent-button id="replaceNext-fluent-button" appearance="stealth" onclick="EditorManager.replaceNext();"><span class="fluent-icons-Search"></span></fluent-button>
        <fluent-button id="replaceAll-fluent-button" appearance="stealth" onclick="EditorManager.replaceAll();"><span class="fluent-icons-DocumentSearch"></span></fluent-button>
      `,
      languageAutocomplete: settings.settings.editor["language-autocompletion"],
      anyWordAutocomplete: settings.settings.editor["any-word-autocompletion"]
    }, File.getLanguageNameFromFilename(filePath));

    FileManager.files[filePath].addEventListener("state-click", async function(event) {
      const dataEditor = event.detail?.dom.parentNode.getAttribute("data-editorName");

      if (dataEditor !== EditorManager.activeEditorName){
        await EditorManager.changeActive(dataEditor);
        FileManager.changeActive(filePath);
      }
      else
        EditorManager.editorInfo(dataEditor);     
    });

  	FileManager.files[filePath].addEventListener("state-keyup", async function() {
      EditorManager.editorInfo(EditorManager.activeEditorName);	
    });

    FileNav.addItem(filePath, FileManager.files[filePath].language);   
  }
  static async initializeFile(filePath){
    if(FileManager.isOpened(filePath) === false)
      return;
    const fileContent = (await Neutralino.filesystem.readFile(filePath)) || "";
    await FileManager.files[filePath].init(fileContent);
  }
  static async changeActive(filePath){
    if (FileManager.isOpened(filePath) === false)
      return;
    
    if (FileManager.activeFilePath === filePath)
      return;

    await FileNav.changeActive(filePath);
    
    FileManager.activeFilePath = filePath;

    Neutralino.window.setTitle(`Fluent Code - ${filePath.slice((filePath.lastIndexOf("/") + 1))}`);
    FileManager.fileInfo(filePath, false);
    FileManager.filePropertiesInfo(filePath);
  }
  static async closeFile(filePath){
    if (FileManager.isOpened(filePath) === false)
      return;

    if(settings.settings.file["save-before-close"] === true)
      await FileManager.saveFile(filePath);

    if(Object.keys(FileManager.files).length > 1){
      for(const editorName in EditorManager.editors){
        if(EditorManager.editors[editorName].getActive() === FileManager.files[filePath])
          await EditorManager.showNextFileInEditor(editorName, filePath);
      }
    }
    else{
      App.showStartPage();
      FileManager.activeFilePath = null;
      Neutralino.window.setTitle("Fluent Code");

      for(const editorName in EditorManager.editors)
        EditorManager.showDefaultPage(editorName);
    }
  	
	delete FileManager.files[filePath];

    await FileNav.removeItem(filePath);
  }
  static async closeAllFiles(){
    if(settings.settings.file["save-before-close"] === true)
      await FileManager.saveAllFiles();

    App.showStartPage();
    
    FileManager.files = [];
    FileManager.activeFilePath = null;
    Neutralino.window.setTitle("Fluent Code");

    await FileNav.removeAllItems();

    for(const editorName in EditorManager.editors)
      EditorManager.showDefaultPage(editorName);
  }
  static async renameFile(filePath, newFilePath){
    if(FileManager.isOpened(filePath) === false || !newFilePath || FileManager.isOpened(newFilePath) === true || filePath.slice(0, (filePath.lastIndexOf("/"))) !== newFilePath.slice(0, (newFilePath.lastIndexOf("/"))) || filePath === newFilePath)
      return;

    try{await Neutralino.filesystem.moveFile(filePath, newFilePath);}catch{
      Neutralino.os.showMessageBox("Error: Cannot rename file", `Unable to rename file, error message: ${error.message}`, "OK", "ERROR");
      return;
    }

    FileManager.files[newFilePath] = FileManager.files[filePath];
    delete FileManager.files[filePath];

    if(FileManager.activeFilePath === filePath){
      FileManager.activeFilePath = newFilePath;
      
      FileManager.fileInfo(FileManager.activeFilePath, false);
      FileManager.filePropertiesInfo(FileManager.activeFilePath);
    }

    await FileNav.renameItem(filePath, newFilePath);
  }
  static async renameFileUsingForm(filePath){
    const newFilePath = (filePath.slice(0, (filePath.lastIndexOf('/') + 1))) + document.querySelector('[data-filePropertiesInfo="filenameWithoutExtension"]').value + filePath.slice(filePath.lastIndexOf('.'));
    
    if(filePath !== newFilePath)
      await FileManager.renameFile(filePath , newFilePath);
  }
  static async saveFile(filePath){
    if(FileManager.isOpened(filePath) === false || FileManager.isInitialized(filePath) === false)
      return;

    await EditorManager.compareEditorsChanges();
    
    if(FileManager.isChanged(filePath) === true){
      await Neutralino.filesystem.writeFile(filePath, FileManager.files[filePath].getDoc());
      FileManager.files[filePath].changed = false;
    }

    App.showBottomNotification("File saved", 3000);
  }
  static async saveAllFiles(){
    if(Object.keys(FileManager.files).length === 0)
      return;
    
    await EditorManager.compareEditorsChanges();
    for(const filePath in FileManager.files){
      if(FileManager.isChanged(filePath) === true){
        await Neutralino.filesystem.writeFile(filePath, FileManager.files[filePath].getDoc());
        FileManager.files[filePath].changed = false;
      }
    }

    App.showBottomNotification("Files saved", 5000);
  }
  static async runFile(filePath){
    if(FileManager.isOpened(filePath) === false)
      return;
    
    const folderPath = filePath.slice(0, filePath.lastIndexOf("/"));
    
    const additionalFileInfo = FileManager.getAdditionalFileInfo(filePath);
    
    if(!additionalFileInfo){
      App.showBottomNotification("Set preview options to run this file");
      return;
    }

    let hasRunOption = false;
    
    if(additionalFileInfo.shouldOpenInDefaultApp === true){
      hasRunOption = true;
      Neutralino.os.open(filePath);
    }

    if(additionalFileInfo.shouldExecuteCommand === true && typeof additionalFileInfo.executeCommandValue === "string"){
      hasRunOption = true;
      Neutralino.os.execCommand(`cd /d "${folderPath}" && ${additionalFileInfo.executeCommandValue}`, {background: true});
    }

    if(additionalFileInfo.shouldOpenLink === true && typeof additionalFileInfo.openLinkValue === "string"){
      hasRunOption = true;
      
      if(additionalFileInfo.openLinkValue.includes(":") === true)
        Neutralino.os.open(additionalFileInfo.openLinkValue);
      else
        Neutralino.os.open(`http:/${additionalFileInfo.openLinkValue}`);
    }

    if(hasRunOption === true)
      App.showBottomNotification("Opening preview...", 4000);
    else 
      App.showBottomNotification("None of preview options has been set")
  }
  static async setAdditionalFileInfo(filePath, additionalInfo){
    if(FileManager.isOpened(filePath) === false)
      return;
    
    FileManager.additionalFileInfo[filePath] = additionalInfo;
  }
  static async setAdditionalFileInfoUsingForm(filePath){
    if(FileManager.isOpened(filePath) === false)
      return;
    
    FileManager.additionalFileInfo[filePath] = {
      shouldOpenInDefaultApp: document.querySelector('[data-additionalFileInfo="openInDefaultAppOption"]').checked,
      shouldExecuteCommand: document.querySelector('[data-additionalFileInfo="exeCommandOption"]').checked,
      executeCommandValue: document.querySelector('[data-additionalFileInfo="exeCommandValue"]').value,
      shouldOpenLink: document.querySelector('[data-additionalFileInfo="openLinkOption"]').checked,
      openLinkValue: document.querySelector('[data-additionalFileInfo="openLinkValue"]').value
    };
  }
  static getAdditionalFileInfo(filePath){
    return FileManager.additionalFileInfo[filePath];
  }
  static async filePropertiesInfo(filePath){
    if(FileManager.isOpened(filePath) === false)
      return;
    
    const fileStats = await Neutralino.filesystem.getStats(filePath);

    function formatSize(size) {
      if(typeof size !== "number")
        return size;

      const fileSizeUnits = ["B", "KB", "MB", "GB", "TB", "PB"];

      return (size/Math.pow(1024, Math.floor(Math.log2(size)/10))).toFixed(1) + " " + fileSizeUnits[ Math.floor(Math.log2(size)/10)];
    }

    function formatDate(date){
      if(typeof date === "number")
        date = new Date(date);
      else if(!date instanceof Date)
        return date;

      const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      return `${date.getDate()} ${monthsNames[(date.getMonth() + 1)]} ${date.getFullYear()}, ${date.getHours()}:${ (date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()}`;
    }

    document.querySelector('[data-filePropertiesInfo="filePath"]').textContent = filePath;
    document.querySelector('[data-filePropertiesInfo="size"]').textContent = formatSize(fileStats.size);
    document.querySelector('[data-filePropertiesInfo="creationDate"]').textContent = formatDate(fileStats.createdAt);
    document.querySelector('[data-filePropertiesInfo="modifyDate"]').textContent = formatDate(fileStats.modifiedAt);

    const filenameWithoutExtension = (filePath.lastIndexOf(".") !== -1)? filePath.slice(0, filePath.lastIndexOf(".")).slice((filePath.lastIndexOf("/")+1)) : filePath.slice((filePath.lastIndexOf("/")+1));
    
    document.querySelector('[data-filePropertiesInfo="filenameWithoutExtension"]').value = filenameWithoutExtension;
    document.querySelector('[data-filePropertiesInfo="filenameWithoutExtension"]').placeholder = filenameWithoutExtension;

    const fileInfo = FileManager.files[filePath].fileInfo();
    
    const fileType = (fileInfo.language)? `${fileInfo.language} file` : `${(filePath.lastIndexOf(".") !== -1)? filePath.slice(filePath.lastIndexOf(".") + 1).toUpperCase() : filenameWithoutExtension.toUpperCase()} file`;
    
    document.querySelector('[data-filePropertiesInfo="fileType"]').textContent = fileType;

    document.querySelector('[data-additionalFileInfo="openInDefaultAppOption"]').checked = FileManager.additionalFileInfo[filePath]?.shouldOpenInDefaultApp;
    document.querySelector('[data-additionalFileInfo="exeCommandOption"]').checked = FileManager.additionalFileInfo[filePath]?.shouldExecuteCommand;
    document.querySelector('[data-additionalFileInfo="exeCommandValue"]').value = FileManager.additionalFileInfo[filePath]?.executeCommandValue ?? "";
    document.querySelector('[data-additionalFileInfo="openLinkOption"]').checked = FileManager.additionalFileInfo[filePath]?.shouldOpenLink;
    document.querySelector('[data-additionalFileInfo="openLinkValue"]').value = FileManager.additionalFileInfo[filePath]?.openLinkValue ?? "";
  }
  static #fileInfoTimeout = null;
  static async fileInfo(filePath, useTimeout = true){
    if(FileManager.isOpened(filePath) === false)
      return;
    
    try{clearTimeout(FileManager.#fileInfoTimeout)}catch{}

  	const fileInfo = FileManager.files[filePath].fileInfo();
  	const infoFunction = async function(){
      document.querySelector('[data-fileInfo="language"]').textContent = fileInfo?.language ?? "?";
      document.querySelector('[data-fileInfo="path"]').textContent = filePath;
  	}
    
  	if (useTimeout === true)
      FileManager.#fileInfoTimeout = setTimeout(infoFunction, 300);
  	else
      infoFunction();
  }
  static #fileAutoSaveInterval = null;
  static async startAutoSave(){
    if(settings.settings.file["auto-save"] === true && settings.settings.file["auto-save-time"] >= 1000)

      if(FileManager.#fileAutoSaveInterval === null)
        FileManager.#fileAutoSaveInterval = setInterval(async function(){
          await FileManager.saveAllFiles();
        }, settings.settings.file["auto-save-time"]);
  }
  static async stopAutoSave(){
    if(settings.settings.file["auto-save"] === true)
      FileManager.saveAllFiles();
      
    if(FileManager.#fileAutoSaveInterval !== null){
      clearInterval(FileManager.#fileAutoSaveInterval);
      FileManager.#fileAutoSaveInterval = null;
    }
  }
}