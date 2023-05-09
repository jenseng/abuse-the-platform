/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  publicPath: process.env.ASSET_HOST
    ? `//${process.env.ASSET_HOST}/build/`
    : "/build/",
};
