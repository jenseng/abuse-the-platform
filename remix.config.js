const childProcess = require("child_process");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  publicPath:
    process.env.NODE_ENV === "production"
      ? (function () {
          let answer = process.env.ASSET_HOST;
          if (!answer) {
            console.log(
              "Enter the host:port that will host the static assets:"
            );
            answer = childProcess
              .execSync("bash -c 'read var; echo $var'", {
                stdio: ["inherit", "pipe", "pipe"],
                encoding: "utf-8",
              })
              .trim();
          }
          return `//${answer}/build/`;
        })()
      : "/build/",
};
