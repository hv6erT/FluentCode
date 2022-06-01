const fileNavIcons = {
  "C": '<i class="devicon-c-plain colored"></i>',
  "C++": '<i class="devicon-cplusplus-plain colored"></i>',
  "C#": '<i class="devicon-csharp-plain colored"></i>',
  "CoffeeScript": '<i class="devicon-coffeescript-original colored"></i>',
  "CSS": '<i class="devicon-css3-plain colored"></i>',
  "Clojure": '<i class="devicon-clojure-line colored"></i>',
  "ClojureScript": '<i class="devicon-clojurescript-plain colored"></i>',
  "Dart": '<i class="devicon-dart-plain colored"></i>',
  "Erlang": '<i class="devicon-erlang-plain colored"></i>',
  "F#": '<i class="devicon-fsharp-plain colored"></i>',
  "HTML": '<i class="devicon-html5-plain colored"></i>',
  "Git files": '<i class="devicon-git-plain colored"></i>',
  "GO": '<i class="devicon-go-original-wordmark colored"></i>',
  "Java": '<i class="devicon-java-plain colored"></i>',
  "JavaScript": '<i class="devicon-javascript-plain colored"></i>',
  "Kotlin": ' <i class="devicon-kotlin-plain colored"></i>',
  "Lua": '<i class="devicon-lua-plain colored"></i>',
  "Node JS": '<i class="devicon-nodejs-plain colored"></i>',
  "Objective-C": '<i class="devicon-objectivec-plain colored"></i>',
  "PHP": '<i class="devicon-php-plain colored"></i>',
  "Python": '<i class="devicon-python-plain colored"></i>',
  "R": '<i class="devicon-r-original colored"></i>',
  "Ruby": '<i class="devicon-ruby-plain colored"></i>',
  "Sass": '<i class="devicon-sass-original colored"></i>',
  "Scala": '<i class="devicon-scala-plain colored"></i>',
  "Swift": '<i class="devicon-swift-plain colored"></i>',
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
    FileNav.#fileItems[fileKey].addEventListener("click", async function(){
      if(FileManager.activeFilePath !== fileKey)
        EditorManager.showFileInEditor(EditorManager.activeEditorName ?? 0, fileKey);
      else
        this.selected = true;
    });
    FileNav.#fileItems[fileKey].addEventListener("dblclick", async function(){
      document.getElementById('fileProperties-fluent-dialog').hidden = false;
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

    const titleNode = document.createElement("span");
    titleNode.innerText = folderKey;
    titleNode.addEventListener("click", async function(){
      FileNav.#groupItems[folderKey].expanded = !FileNav.#groupItems[folderKey].expanded;
    });
    
    FileNav.#groupItems[folderKey] = document.createElement("fluent-tree-item");
    FileNav.#groupItems[folderKey].className = "margin-y margin-top";
    FileNav.#groupItems[folderKey].setAttribute("data-fileNavGroupItem", folderKey);
    FileNav.#groupItems[folderKey].addEventListener("click", async function(event){
      if(this.expanded === false && FileManager.activeFilePath.includes(folderKey))
        this.selected = true;
      else{
        this.selected = false;
        FileNav.changeActive(FileManager.activeFilePath);
      }
    });

    FileNav.#groupItems[folderKey].appendChild(titleNode);
    
    FileNav.#fileNavNode.prepend(FileNav.#groupItems[folderKey]);
  }
  static async changeActive(fileKey){
    if(FileNav.#fileItems.hasOwnProperty(fileKey) === false)
      return;

    for(const key in FileNav.#fileItems)
      FileNav.#fileItems[key].selected = false;

    FileNav.#fileItems[fileKey].selected = true;
  }
  static async renameItem(fileKey, newFileKey, newFileIconKey){
    if(FileNav.#fileItems.hasOwnProperty(fileKey) === false || !newFileKey || FileNav.#fileItems.hasOwnProperty(newFileKey) === true || fileKey.slice(0, (fileKey.lastIndexOf("/"))) !== newFileKey.slice(0, (newFileKey.lastIndexOf("/"))))
      return;

    FileNav.#fileItems[newFileKey] = FileNav.#fileItems[fileKey];
    delete FileNav.#fileItems[fileKey];

    if(newFileIconKey)
      FileNav.#fileItems[newFileKey].querySelector(".fileNavItemIcon-span").innerHTML = (fileNavIcons[newFileIconKey] !== undefined) ? fileNavIcons[newFileIconKey] : "";

    FileNav.#fileItems[newFileKey].querySelector(".fileNavItemTitle-span").innerText = newFileKey.slice((newFileKey.lastIndexOf("/")+1));
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
    
    if(searchQuery === ""){
      document.getElementById("sideNav-fluent-tabs").activeid = "fileNavTab-container";
      return;
    }
    else
      document.getElementById("sideNav-fluent-tabs").activeid = "searchNavTab-container";
    
    for(const key in FileNav.#fileItems){
      if(key.includes(searchQuery) === true){
        FileNav.#searchItems[key] = FileNav.#fileItems[key].cloneNode(true);
        FileNav.#searchNavNode.appendChild(FileNav.#searchItems[key]);
      }
    }
  }
}