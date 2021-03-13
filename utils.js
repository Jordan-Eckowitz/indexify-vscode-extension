// packages
const { readdirSync, readFileSync, lstatSync } = require("fs");
const uniq = require("lodash.uniq");

const namedExports = (content) => {
  console.log(content);
  const requiredSingleNamedExport =
    content.match(/(?<=\b(exports.))(\w+)/g) || [];
  const requiredMulti = content.match(
    /(?<=(module.exports(\s*)=(\s*){))(.*?)(?=})/gs
  );
  const requiredMultiNamedExport = requiredMulti
    ? requiredMulti
        .map((str) => {
          if (str.match(",")) {
            return str.split(",").map((exp) => exp.trim());
          }
          return str;
        })
        .flat()
        .filter((item) => item.length > 0)
    : [];
  console.log("SINGLE", requiredSingleNamedExport);
  console.log("MULTI", requiredMultiNamedExport);
  const output = uniq([
    ...requiredSingleNamedExport,
    ...requiredMultiNamedExport,
  ]);
  console.log("OUTPUT", output);
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
