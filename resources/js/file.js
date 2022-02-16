const uploadFile = async () => {
  await Neutralino.window.hide();
  const data = await Neutralino.os.showOpenDialog("Upload file", {multiSelections: true});
  await Neutralino.window.show();
  await Neutralino.window.focus();
  const filePaths = data.map(function(filePath){return normalizePath(filePath);});

  if(filePaths.length === 0)
    return;

  let fileToShow = filePaths[(filePaths.length - 1)];
  
  for(const filePath of filePaths){
    if(FileManager.isOpened() === false)
      await FileManager.openFile(filePath);
    else fileToShow = filePath;
  }
  EditorManager.showFileInEditor(EditorManager.activeEditorName, fileToShow);
}

const createNewFile = async () => {
  await Neutralino.window.hide();
  const filePath = normalizePath(await Neutralino.os.showSaveDialog("Create new file"));
  await Neutralino.window.show();
  await Neutralino.window.focus();
  if(!filePath)
    return;
  await Neutralino.filesystem.writeFile(filePath, "");
  await FileManager.openFile(filePath);
  EditorManager.showFileInEditor(EditorManager.activeEditorName, filePath);
}

const uploadFolder = async () => {
  await Neutralino.window.hide();
  const folderPath = normalizePath(await Neutralino.os.showFolderDialog("Upload directory"));
  await Neutralino.window.show();
  await Neutralino.window.focus();
  const filePaths = (await Neutralino.filesystem.readDirectory(folderPath)).filter(function(object){
    if(object.type === "FILE")
      return object;
  }).map(function(object){
    return normalizePath(folderPath + "/" + object.entry);
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
}

const openSettingsFile = async () => {
  await FileManager.openFile(userPreferences.settingsFilePath);
  EditorManager.showFileInEditor(EditorManager.activeEditorName, userPreferences.settingsFilePath);
}

class FileManager {
  static files = {};
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
  static #fileTheme = null;
  static #fileHighlight = null;
  static async openFile(filePath){
    if(FileManager.isOpened(filePath) === true || await FileManager.canAccess(filePath) === false)
      return;

    if(FileManager.#fileTheme === null){
      const baseThemePath = "../jsModules/theme/base-theme.js", appThemePath = "../jsModules/theme/app-theme.js", themePath = settings.settings.modes[`${userPreferences.colorMode}-mode`].theme;

      FileManager.#fileTheme = [
        (await import(baseThemePath)).default,
        (await import(appThemePath)).default
      ];

      const customFileTheme = (await import(themePath)).default;
      if(customFileTheme)
        FileManager.#fileTheme.push(customFileTheme);
    }

    if(FileManager.#fileHighlight === null){
      const highlightPath = settings.settings.modes[`${userPreferences.colorMode}-mode`].highlight;
      const customFileHighlight = (await import(highlightPath)).default;

      if(customFileHighlight)
        FileManager.#fileHighlight = [customFileHighlight];
    }

    if(window.File === null)
      window.File = (await import("../jsModules/editor/file.js")).default;
    
    FileManager.files[filePath] = new File({
      panelNode: document.getElementById("top-nav-search-box"),
      theme: FileManager.#fileTheme,
      highlight: FileManager.#fileHighlight,
      tabSize: settings.settings.editor["tab-size"],
      tabSupport: false,
      fontSize: (settings.settings.editor["font-size"]+"px"),
      lineWrapping: settings.settings.editor["line-wrapping"],
      panelNode: document.getElementById("searchAndReplace-form"),
      progressBar: settings.settings.editor["progress-bar"],
      colorPreview: settings.settings.editor["color-preview"],
      customSelectionTooltip: false,
      customSearchPanel: 
        `<div class="flex" style="gap: 10px;">
          <fluent-text-field name="search" appearance="filled" placeholder="Search phrases" oninput="EditorManager.searchAndReplace({search: this.value})" onkeyup="keyboardEventActions(event, 'Enter', EditorManager.findNext)"></fluent-text-field>
          <fluent-button appearance="stealth" onclick="EditorManager.findPrevious();"><span class="fluent-icon fluent-icon--Previous"></span></fluent-button>
          <fluent-button appearance="stealth" onclick="EditorManager.findNext();"><span class="fluent-icon fluent-icon--Next"></span></fluent-button>
          <fluent-text-field name="replace" appearance="filled" placeholder="Replace words" oninput="EditorManager.searchAndReplace({replace: this.value})" onkeyup="keyboardEventActions(event, 'Enter', EditorManager.replaceNext)"></fluent-text-field>
          <fluent-button appearance="stealth" onclick="EditorManager.replaceNext();"><span class="fluent-icon fluent-icon--Search"></span></fluent-button>
          <fluent-button appearance="stealth" onclick="EditorManager.replaceAll();"><span class="fluent-icon fluent-icon--SearchAndApps"></span></fluent-button>
        </div>
        `,
      languageAutocomplete: settings.settings.editor["language-autocompletion"],
      anyWordAutocomplete: settings.settings.editor["any-word-autocompletion"]
    }, File.getLanguageNameFromFilename(filePath));

    FileManager.files[filePath].addEventListener("state-click", async function(event) {
      const dataEditor = event.detail?.dom.parentNode.getAttribute("data-editorName");
      
      if (dataEditor !== EditorManager.activeEditorName)
        await EditorManager.changeActive(dataEditor);
      else{
        FileManager.changeActive(EditorManager.editors[dataEditor].getActive().path);
        EditorManager.editorInfo(dataEditor);
      }
    
    });

  	FileManager.files[filePath].addEventListener("state-keyup", async function() {
      EditorManager.editorInfo(EditorManager.activeEditorName);	
    });

    await FileNav.addItem(filePath);
    
  }
  static async initializeFile(filePath){
    if(FileManager.isOpened(filePath) === false)
      return;
    const fileContent = await Neutralino.filesystem.readFile(filePath) || "";
    await FileManager.files[filePath].init(fileContent);
  }
  static async changeActive(filePath){
    if (FileManager.isOpened(filePath) === false)
      return;
    
    if (FileManager.activeFile === filePath)
      return;

    await FileNav.changeActive(filePath);
    
    FileManager.activeFile = filePath;
    FileManager.fileInfo(filePath, false);
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
      showEditorStartPageArticle();
      FileManager.activeFilePath = null;
      if(Object.keys(EditorManager.editors).length > 1){
        for(let i = (Object.keys(EditorManager.editors).length - 1); i>1; i--)
          EditorManager.closeEditor(Object.keys(EditorManager.editors)[i]);
      }
    }
  	
	delete FileManager.files[filePath];

    await FileNav.removeItem(filePath);
  }
  static async closeAllFiles(){
    if(settings.settings.file["save-before-close"] === true)
      await FileManager.saveAllFiles();

    showEditorStartPageArticle();
    
    FileManager.files = [];
    FileManager.activeFile = null;

    await FileNav.removeAllItems();

    if(Object.keys(EditorManager.editors).length > 1){
      for(let i = (Object.keys(EditorManager.editors).length - 1); i>1; i--)
        EditorManager.closeEditor(Object.keys(EditorManager.editors)[i]);
    }
    
  }
  static async saveFile(filePath){
    if(FileManager.isOpened(filePath) === false || FileManager.isInitialized(filePath) === false)
      return;

    await EditorManager.compareEditorsChanges();
    
    if(FileManager.isChanged(filePath) === true){
      await Neutralino.filesystem.writeFile(filePath, FileManager.files[filePath].getDoc());
      FileManager.files[filePath].changed = false;
    }
  }
  static async saveAllFiles(){
    await EditorManager.compareEditorsChanges();
    for(const filePath in FileManager.files){
      if(FileManager.isChanged(filePath) === true){
        await Neutralino.filesystem.writeFile(filePath, FileManager.files[filePath].getDoc());
        FileManager.files[filePath].changed = false;
      }
    }
  }
  static #fileInfoTimeout = null;
  static async fileInfo(filePath, useTimeout = true){
    if(FileManager.isOpened(filePath) === false)
      return;
    try{clearTimeout(FileManager.#fileInfoTimeout)}catch{}

  	const fileInfo = FileManager.files[filePath].fileInfo();
  	const infoFunction = async function(){
      document.querySelector('[data-fileInfo="language"]').textContent = fileInfo.language;
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
      FileManager.#fileAutoSaveInterval = setInterval(async function(){
        await FileManager.saveAllFiles();
      }, settings.settings.file["auto-save-time"]);
  }
  static async stopAutoSave(){
    if(settings.settings.file["auto-save"] === true)
      FileManager.saveAllFiles();
      
    if(FileManager.#fileAutoSaveInterval !== null)
      clearInterval(FileManager.#fileAutoSaveInterval);
  }
}