// packages
const { readdirSync, readFileSync, lstatSync } = require("fs");

// utils
const { namedExports } = require("./named-exports");
const { anonymousExports } = require("./anonymous-exports");
const { defaultExports } = require("./default-exports");

const readFile = (filepath) => {
  const content = readFileSync(filepath, "utf8");

  const requiredNamedExports = namedExports(
    content,
    /(?<=\b(exports.))(\w+)/g,
    /(?<=(module.exports(\s*)=(\s*){))(.*?)(?=})/gs
  );
  const staticNamedExports = namedExports(
    content,
    /(?<=\b(export(\s*)(const|let|var)(\s*)))(\w+)/g,
    /(?<=(export(\s*){))(.*?)(?=})/gs
  );

  const requiredAnonymousExports = anonymousExports(
    filepath,
    content,
    /((?<=(module.exports(\s*)=))(.*)(?=\())/g
  );
  const staticAnonymousExports = anonymousExports(
    filepath,
    content,
    /((?<=(export(\s*)default))(.*?)(?=\())/g
  );

  const requiredDefaultExports = defaultExports(
    content,
    /(?<=\b(module.exports(\s*)=(\s*)))(\w+)/g
  );
  const staticDefaultExports = defaultExports(
    content,
    /(?<=\b(export default(\s*)function(\s*))|(export default(\s*)class(\s*))|(export default(\s*)))((?!class|function)\w+)/g
  );

  console.log("REQUIRED", requiredDefaultExports);
  console.log("STATIC", staticDefaultExports);
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
