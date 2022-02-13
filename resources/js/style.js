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

const hideNode = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node && node.style.display !== "none")
    node.style.display = "none";
}

const preventDefault = (event) => event.preventDefault();

const scrollIntoView = async nodeOrNodeSelector => {
  let node = null;

  if(typeof nodeOrNodeSelector === "string")
    node = document.querySelector(nodeOrNodeSelector);
  else if(nodeOrNodeSelector instanceof Element)
    node = nodeOrNodeSelector;
  
  if(node)
    node.scrollIntoView({behavior: "smooth"});
}