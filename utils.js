// packages
const { readdirSync, lstatSync } = require("fs");

module.exports.findFiles = (path) => {
  const dirItems = readdirSync(path);
  dirItems.forEach((dirItem) => {
    const isFile = lstatSync(`${path}/${dirItem}`).isFile();
    if (isFile) return console.log(`FILE - ${dirItem}`);
    return console.log(`FOLDER - ${dirItem}`);
  });
};
