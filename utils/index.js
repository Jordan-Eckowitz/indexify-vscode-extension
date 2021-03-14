// packages
const { readdirSync, readFileSync, lstatSync } = require("fs");

// utils
const { namedExports } = require("./named-exports");

const readFile = (filepath) => {
  const content = readFileSync(filepath, "utf8");
  namedExports(content);
};

module.exports.findFiles = (path) => {
  const dirItems = readdirSync(path);
  dirItems.forEach((dirItem) => {
    const dirItemPath = `${path}/${dirItem}`;
    const isFile = lstatSync(dirItemPath).isFile();
    if (isFile) {
      // only ready *.ts, *.tsx, *.js, *.jsx files
      if (dirItemPath.match(/ts|js/g)) {
        return readFile(dirItemPath);
      }
    }
    // return console.log(`FOLDER - ${dirItem}`);
  });
};
