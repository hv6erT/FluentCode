"use strict";

const stopImmediatePropagation = async event => {
  event.stopImmediatePropagation();
}

const toggleNodeDisplay = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;

  if(node && node.style.display === "none")
    node.style.display = "";
  else if(node)
    node.style.display = "none";
}

const modifyNodeAttribute = async (nodeOrNodeSelector, attributeName, attributeValue) =>{
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;

  if(node)
    node[attributeName] = attributeValue;
}

const showNode = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node && node.style.display === "none")
    node.style.display = "";
}

const hideNode = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node && node.style.display !== "none")
    node.style.display = "none";
}

window.searchEventAction = (event, action) => {
  if(!event || !action)
    return;

  let timeout = null;
  if(event instanceof InputEvent){
    if(timeout !== null){
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(function(){action();}, 1000);
  }
}

window.keyboardEventActions = (event, actionKey, action) => {
  if(!event || !actionKey || !action)
    return;
  if(event.key == actionKey)
    return action();
}