const fileNavIcons = {
  "C": '<i class="devicon-c-plain colored"></i>',
  "C++": '<i class="devicon-cplusplus-plain colored"></i>',
  "C#": '<i class="devicon-csharp-plain colored"></i>',
  "CSS": '<i class="devicon-css3-plain colored"></i>',
  "HTML": '<i class="devicon-html5-plain colored"></i>',
  "Git files": '<i class="devicon-git-plain colored"></i>',
  "Java": '<i class="devicon-java-plain colored"></i>',
  "JavaScript": '<i class="devicon-javascript-plain colored"></i>',
  "Lua": '<i class="devicon-lua-plain colored"></i>',
  "Node JS": '<i class="devicon-nodejs-plain colored"></i>',
  "PHP": '<i class="devicon-php-plain colored"></i>',
  "Python": '<i class="devicon-python-plain colored"></i>',
  "TypeScript": '<i class="devicon-typescript-plain colored"></i>'
};

class FileNav {
  static #fileItems = {};
  static #searchItems = {};
  static #groupItems = {};
  static #fileNavNode = document.getElementById("fileNav-container");
  static #searchNavNode = document.getElementById("searchNav-container");
  static async addItem(fileKey, fileIconKey){
    if(FileNav.#fileItems.hasOwnProperty(fileKey) === true)
      return;

    const iconNode = document.createElement("span");
    iconNode.className = "fileNavItemIcon-span";
    iconNode.innerHTML = (fileNavIcons[fileIconKey] !== undefined) ? fileNavIcons[fileIconKey] : "";

    const titleNode = document.createElement("span");
    titleNode.className = "fileNavItemTitle-span";
    titleNode.innerText = fileKey.slice((fileKey.lastIndexOf("/")+1));

    const closeButtonNode = document.createElement("span");
    closeButtonNode.className = "fileNavItemCloseButton-span";
    closeButtonNode.innerHTML = `<span class="fluent-icon fluent-icon--ChromeClose"></span>`;
    closeButtonNode.addEventListener("click", function(event){
      event.stopPropagation();
      FileManager.closeFile(fileKey);
    });
    
    const folderKey = fileKey.slice(0, fileKey.lastIndexOf("/"));
    for(const key in FileNav.#fileItems){
      if(key.slice(0, key.lastIndexOf("/")) === folderKey){
        if(FileNav.#groupItems.hasOwnProperty(folderKey) === false)
          await FileNav.#addGroupItem(folderKey)
        FileNav.#fileItems[key].remove();
        FileNav.#groupItems[folderKey].appendChild(FileNav.#fileItems[key]);
      }
    }    

    FileNav.#fileItems[fileKey] = document.createElement("fluent-tree-item");
    FileNav.#fileItems[fileKey].className = "fileNavItem margin-y  margin-top";
    FileNav.#fileItems[fileKey].setAttribute("data-fileNavItem", fileKey);
    FileNav.#fileItems[fileKey].addEventListener("click", function(){
      EditorManager.showFileInEditor(EditorManager.activeEditorName ?? 0, fileKey);
    });
    
    if (fileNavIcons[fileIconKey] !== undefined)
      FileNav.#fileItems[fileKey].appendChild(iconNode);
    FileNav.#fileItems[fileKey].appendChild(titleNode);
    FileNav.#fileItems[fileKey].appendChild(closeButtonNode);
    
    if(FileNav.#groupItems.hasOwnProperty(folderKey))
      FileNav.#groupItems[folderKey].appendChild(FileNav.#fileItems[fileKey]);
    else
      FileNav.#fileNavNode.appendChild(FileNav.#fileItems[fileKey]);
  }
  static async #addGroupItem(folderKey){
    if(FileNav.#groupItems.hasOwnProperty(folderKey) === true)
      return;
    
    FileNav.#groupItems[folderKey] = document.createElement("fluent-tree-item");
    FileNav.#groupItems[folderKey].className = "margin-y margin-top";
    FileNav.#groupItems[folderKey].setAttribute("data-fileNavGroupItem", folderKey);
    FileNav.#groupItems[folderKey].innerText = folderKey;
    
    FileNav.#fileNavNode.prepend(FileNav.#groupItems[folderKey]);
  }
  static async changeActive(fileKey){
    if(FileNav.#fileItems.hasOwnProperty(fileKey) === false)
      return;

    for(const key in FileNav.#fileItems)
      FileNav.#fileItems[key].selected = false;

    FileNav.#fileItems[fileKey].selected = true;
  }
  static async removeItem(fileKey){
    if(FileNav.#fileItems.hasOwnProperty(fileKey) === false)
      return;

    FileNav.#fileItems[fileKey].remove();
    delete FileNav.#fileItems[fileKey];

    if(FileNav.#searchItems.hasOwnProperty(fileKey) === true){
      FileNav.#searchItems[fileKey].remove();
      delete FileNav.#searchItems[fileKey];
    }
    
    const folderKey = fileKey.slice(0, fileKey.lastIndexOf("/"));
    if(FileNav.#groupItems.hasOwnProperty(folderKey) === true){
      if(FileNav.#groupItems[folderKey].querySelectorAll(`[data-fileNavItem]`).length === 0)
        await FileNav.#removeGroupItem(folderKey);
    }
  }
  static async removeAllItems(){
    for(const fileKey in FileNav.#fileItems){
      FileNav.#fileItems[fileKey].remove();
      
      if(FileNav.#searchItems.hasOwnProperty(fileKey) === true)
        FileNav.#searchItems[fileKey].remove();
    }
      
    FileNav.#fileItems = {};
    FileNav.#searchItems = {};

    for(const folderKey in FileNav.#groupItems)
      FileNav.#groupItems[folderKey].remove();

    FileNav.#groupItems = {};
  }
  static async #removeGroupItem(folderKey){
    if(FileNav.#groupItems.hasOwnProperty(folderKey) === false)
      return;

    FileNav.#groupItems[folderKey].remove();
    delete FileNav.#groupItems[folderKey];
  }
  static async searchInFileItems(searchQuery){
    FileNav.#searchNavNode.innerHTML = "";
    
    if(searchQuery === "")
      return;
    
    for(const key in FileNav.#fileItems){
      if(key.includes(searchQuery) === true){
        FileNav.#searchItems[key] = FileNav.#fileItems[key].cloneNode(true);
        FileNav.#searchNavNode.appendChild(FileNav.#searchItems[key]);
      }
    }
  }
}