const childProcess = require("child_process");
const rcedit = require("rcedit");

childProcess.execSync("neu build", {
  cwd: "../"
});

rcedit("../dist/fluentcode/fluentcode-win_x64.exe", {
  icon: "../resources/favicon.ico"
});