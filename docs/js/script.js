const downloads = {
  win_installer: "https://github.com/hv6erT/FluentCode/raw/main/dist/Fluent%20Code%20Installer.exe",
  win_portable: "https://github.com/hv6erT/FluentCode/raw/main/dist/Fluent%20Code%20Portable.zip",
  linux_portable: "https://github.com/hv6erT/FluentCode/raw/main/dist/Fluent%20Code%20for%20Linux%20(Portable).zip",
  darwin_portable: "https://github.com/hv6erT/FluentCode/raw/main/dist/Fluent%20Code%20for%20MacOS%20(Portable).zip"
};

async function changeLocation(href){
  if(typeof href !== "string")
    throw new Error("Invalid argument value");

  if(!href.includes("./") && !href.includes("#"))
    window.open(href, '_blank');
  else
    window.location.href = href;
}

async function downloadFile(fileUrl, fileName) {
  if(typeof fileUrl !== "string" || typeof fileName !== "string")
    throw new Error("Invalid argument value");
  
  const a = document.createElement("a");
  a.setAttribute("href", fileUrl);
  a.setAttribute("download", fileName);
  
  a.click();
}