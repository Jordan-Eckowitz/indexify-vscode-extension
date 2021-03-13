// packages
const { readdirSync, readFileSync, lstatSync } = require("fs");

const namedExports = (content) => {
  console.log(content);
  const singleNamedExport = content.match(
    /(?<=\b(export(\s*)(const|let|var)(\s*))|(exports.))(\w+)/g
  );
  const multiNamedExport = content.match(
    /(?<=(module.exports(\s*)=(\s*){))(.*?)(?=})/gs
  );
  console.log("SINGLE", singleNamedExport);
  console.log("MULTI", multiNamedExport);
};

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
