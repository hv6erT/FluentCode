"use strict";

//change methods
const showEditorArticle = async () => {
  document.getElementById("editorStartPage-article").style.display = "none";
  document.getElementById("editor-article").style.display = "";
  //other nodes
  document.getElementById("bottomInfo-div").style.display = "";
}

const showEditorStartPageArticle = async () => {
  document.getElementById("editor-article").style.display = "none";
  document.getElementById("editorStartPage-article").style.display = "";
  //other nodes
  document.getElementById("bottomInfo-div").style.display = "none";
}

const getActiveArticle = () => {
  const articles = [
    document.getElementById("editor-article"),
    document.getElementById("editor-start-page-article"),
  ];
  for (const article of articles){
    if (getComputedStyle(article).display != "none")
      return article;
  }
}

const showContentMain = async () => {
  document.getElementById("settings-main").style.display = "none";
  document.getElementById("loading-main").style.display = "none";
  document.getElementById("content-main").style.display = "";
}

const showSettingsMain = async () => {
  document.getElementById("content-main").style.display = "none";
  document.getElementById("loading-main").style.display = "none";
  document.getElementById("settings-main").style.display = "";
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

const hideNode = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node && node.style.display !== "none")
    node.style.display = "none";
}

const showBottomNavNotification = async (message, time) => {
  const node = document.getElementById("bottomNavShortInfo-span");

  node.textContent = message;

  if(typeof time === "number"){
    setTimeout(async function(){
      if(node.textContent === message)
        node.textContent = "";
    }, time)
  }
  else if(time !== undefined)
    throw new Error("Invalid value of time param. Param should be a Number");
}

const enableTopNavButtons = async () => {
  const nodeIdList = [
    "createSplitView-fluent-button",
    "exitSplitView-fluent-button",
    "saveAllFiles-fluent-button",
    "cutText-fluent-button",
    "copyText-fluent-button",
    "pasteText-fluent-button",
    "closeAllFiles-fluent-menu-item",
    "fileProperties-fluent-menu-item"
  ];

  for(const nodeId of nodeIdList)
    document.getElementById(nodeId).disabled = false;
}

const disableTopNavButtons = async () => {
  const nodeIdList = [
    "createSplitView-fluent-button",
    "exitSplitView-fluent-button",
    "saveAllFiles-fluent-button",
    "cutText-fluent-button",
    "copyText-fluent-button",
    "pasteText-fluent-button",
    "editorUndo-fluent-menu-item",
    "editorRedo-fluent-menu-item",
    "closeAllFiles-fluent-menu-item",
    "fileProperties-fluent-menu-item"
  ];

  for(const nodeId of nodeIdList)
    document.getElementById(nodeId).disabled = true;
}