"use strict";

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

const hideNode = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node && node.style.display !== "none")
    node.style.display = "none";
}