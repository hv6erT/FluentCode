import childProcess from "child_process";
import fileSystem from "fs";

import rcedit from "rcedit";

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