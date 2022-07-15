const startTime = Date.now();

import childProcess from "child_process";
import fileSystem from "fs";

import rcedit from "rcedit";
import admZip from "adm-zip";
import innoSetup from "innosetup-compiler";

const appInfo = JSON.parse(await fileSystem.promises.readFile("./../neutralino.config.json"));

//Step 1. Build neutralino app
childProcess.execSync("neu build", {
  cwd: "../"
});

//Step 2. Rename binary files
await fileSystem.promises.rename("../dist/fluentcode/fluentcode-win_x64.exe", "../dist/fluentcode/Fluent Code.exe");
await fileSystem.promises.rename("../dist/fluentcode/fluentcode-linux_x64", "../dist/fluentcode/Fluent Code for Linux");
await fileSystem.promises.rename("../dist/fluentcode/fluentcode-mac_x64", "../dist/fluentcode/Fluent Code for Mac OS");

//Step 3. Change icons of binary files
rcedit("../dist/fluentcode/Fluent Code.exe", {
  icon: "../resources/favicon.ico"
});

//Step 4. Create update file
const updateInfo = {
  applicationId: appInfo.applicationId,
  version: appInfo.version,
  resourcesURL: `https://raw.githubusercontent.com/hv6erT/FluentCode/main/dist/fluentcode/resources.neu`,
  data: {}
};

await fileSystem.promises.writeFile("../dist/update.json", JSON.stringify(updateInfo, null, 4));

//Step 5. Create installation files for windows portable

(async function () {
  const zip = new admZip();
  zip.addLocalFile("../dist/fluentcode/Fluent Code.exe");
  zip.addLocalFile("../dist/fluentcode/WebView2Loader.dll");
  zip.addLocalFile("../dist/fluentcode/resources.neu");
  zip.writeZip("../dist/Fluent Code Portable.zip");
})();

//Step 6. Create installation files for linux portable

(async function () {
  const zip = new admZip();
  zip.addLocalFile("../dist/fluentcode/Fluent Code for Linux");
  zip.addLocalFile("../dist/fluentcode/WebView2Loader.dll");
  zip.addLocalFile("../dist/fluentcode/resources.neu");
  zip.writeZip("../dist/Fluent Code for Linux (Portable).zip");
})();

//Step 7. Crete instllation files for Mac OS portable

(async function () {
  const zip = new admZip();
  zip.addLocalFile("../dist/fluentcode/Fluent Code for Mac OS");
  zip.addLocalFile("../dist/fluentcode/WebView2Loader.dll");
  zip.addLocalFile("../dist/fluentcode/resources.neu");
  zip.writeZip("../dist/Fluent Code for MacOS (Portable).zip");
})();

//Step 8. Create windows installator using innosetup

innoSetup("./pack.iss");

//Finish

const endTime = Date.now();

console.log(`Fluent Code build finished in ${endTime - startTime}ms`);