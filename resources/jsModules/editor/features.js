export default class Features{
  static async colorPreviewTooltip(){      
    function getWordByPosition(str, pos){
      const leftSideString = str.substr(0, pos);
      const rightSideString = str.substr(pos);
          
      const leftMatch = leftSideString.match(/[^,\s]*$/);
      const rightMatch = rightSideString.match(/^[^,\s]*/);
          
      let word = '';
          
      if (leftMatch) 
        word += leftMatch[0];
          
      if (rightMatch) 
        word += rightMatch[0];
      
      return word;
    }
      
    function isColor(string){
      const span = document.createElement("span");
      span.style.color = string;
      return (span.style.color.length > 0 && !string.includes("var("));
    }
      
    function validateProperty(string){
      //delete ":" from the start 
      if (string.charAt(0) == ":")
        string = string.slice(1);
      //delete "," or ";" from the end
      if (string.charAt(string.length - 1) == ";")
        string = string.slice(0, (string.length - 1));
      if (string.charAt(string.length - 1) == ",")
        string = string.slice(0, (string.length - 1));
            
      //delete `"` from the start or end
      if (string.charAt(0) == `"`)
        string = string.slice(1);
      if (string.charAt(string.length - 1) == `"`)
        string = string.slice(0, (string.length - 1));
              
      return string;
    }

    const hoverTooltip = (await import("./codemirror.js")).hoverTooltip;
    return hoverTooltip((view, pos, side) => {
      return {
        pos: pos,
        above: true,
        create(view) {
          const word = validateProperty(getWordByPosition(view.state.doc.toString(), pos));
          const dom = document.createElement("div");
  
          if (isColor(word)===false){
            dom.style.display = "none";
            return {dom};
          }
            
          dom.classList.add("cm-color-preview-background");
          dom.style.minWidth = "20px";
          dom.style.minHeight = "20px";
                    
          const colorDom = document.createElement("div");
          colorDom.classList.add("cm-color-preview");
          colorDom.style.position = "relative";
          colorDom.style.left = "-1px"
          colorDom.style.right = "-1px"
          colorDom.style.top = "-1px"
          colorDom.style.bottom = "-1px"
          colorDom.style.width = "calc(100% + 2px)";
          colorDom.style.height = "calc(100% + 2px)";
          colorDom.style.backgroundColor = word;
                    
          dom.appendChild(colorDom);
              
          return {dom};
        }
      }
    });
  }
  static async scrollProgressBar(){
    const ViewPlugin = (await import("./codemirror.js")).ViewPlugin;
    const EditorView = (await import("./codemirror.js")).EditorView;

    return ViewPlugin.fromClass(class{
      constructor(view){
        if (!view)
          throw new Error ("Invalid argument value, first param should be instanceof EditorView");
        
        this.viewScrollDOM = view.scrollDOM;
              
        this.dom = document.createElement("progress");
        this.dom.style.visibility = "hidden";
              	
        this.dom.classList.add("cm-progress-bar");
        
        view.dom.insertBefore(this.dom, this.viewScrollDOM);
      }
      async updateProgressBar(){      
        if (!this.dom || !this.viewScrollDOM){
          throw new Error("Editor has been changed externally");
        }
        const scrollHeight = parseInt(this.viewScrollDOM.scrollHeight).toPrecision(3)*1000;
        const scrollTop = (parseInt(this.viewScrollDOM.scrollTop) + parseInt(getComputedStyle(this.viewScrollDOM).height)).toPrecision(3) * 1000;
                  
        const newValue = scrollTop / scrollHeight;
        
        if (!isNaN(newValue)){
          this.dom.value = newValue;
          this.dom.style.visibility = "visible";
        }
      }
      async destroy(){
        this.dom.remove();
      } 
      },{
        eventHandlers: {
          scroll(event, view){
            this.updateProgressBar();
          }
        }
      });
    }
  	static async customSelectionTooltip(childDom){
      	if(!childDom)
          	throw new Error("Invalid value of first argument, childDom need to be Node or DOMString");
      	const {Tooltip, showTooltip} = await import("./codemirror.js");
        const {StateField} = await import("./codemirror.js");
      
        function getSelectionTooltips(state){
          let selectionTooltopTimeout;
          return state.selection.ranges.filter(range => !range.empty).map(range => {
            return {
              pos: range.head,
              above: false,
              strictSide: true,
              arrow: false,
              create: () => {
                if(selectionTooltopTimeout)
              	clearTimeout(selectionTooltopTimeout);
                  
                const dom = document.createElement("div");
                dom.className = "cm-selection-tooltip";
                dom.style.display = "none";
                if(typeof childDom === "string")
                  dom.innerHTML = childDom;
                else if (childDom instanceof Element)
                  dom.appendChild(childDom);
                selectionTooltopTimeout = setTimeout(function(){dom.style.display = "";}, 700)
                return {dom}
              }
            }
          })
        }
      
       return StateField.define({
        create: getSelectionTooltips,
        update: (tooltips, tr) => {
          if (!tr.docChanged && tr.selection)        
            return getSelectionTooltips(tr.state);
          else
            return tooltips; 
        },
        provide: f => showTooltip.computeN([f], state => state.field(f))
      });
    }
    static async customSearchPanel(childDom){
		if(!childDom)
          	throw new Error("Invalid value of first argument, childDom need to be Node or DOMString");
      
        const searchConfig = (await import("./codemirror.js")).searchConfig;
        const getSearchQuery = (await import("./codemirror.js")).getSearchQuery;

      	return searchConfig({
          createPanel: function (view) {
    		const panel = {};
              
            const dom = document.createElement("div");
            if(typeof childDom === "string")
              dom.innerHTML = childDom;
            else if (childDom instanceof Element)
              dom.appendChild(childDom);

            panel.dom = dom;
            panel.mount = function(){
              const lastSearchQuery = getSearchQuery(view.state);
                    
              const searchInput = panel.dom.querySelector("[name=search]");
              if(searchInput && lastSearchQuery.search)
                searchInput.value = lastSearchQuery.search;
  
              const caseSensitiveInput = panel.dom.querySelector("[name=case-sensitive]");
              if(caseSensitiveInput && caseSensitiveInput.checked !== undefined && typeof lastSearchQuery.caseSensitive === "boolean")
                caseSensitiveInput.checked = lastSearchQuery.caseSensitive;
                    
              const regexpInput = panel.dom.querySelector("[name=regexp]");
              if(regexpInput && regexpInput.checked !== undefined && typeof lastSearchQuery.regexp === "boolean")
                regexpInput.checked = lastSearchQuery.regexp;
                    
              const replaceInput = panel.dom.querySelector("[name=replace]");
                if(replaceInput && lastSearchQuery.replace)
                  replaceInput.value = lastSearchQuery.replace;
            }
            return panel;
        }
    });
  }
}