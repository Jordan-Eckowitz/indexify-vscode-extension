// packages
const { readdirSync, readFileSync, lstatSync } = require("fs");

// utils
const { namedExports } = require("./named-exports");
const { anonymousExports } = require("./anonymous-exports");
const { defaultExports } = require("./default-exports");
const { typeExports } = require("./type-exports");

// regex - required
const requiredNamedSingle = /(?<=\b(exports\.))(\w+)/g;
const requiredNamedMulti = /(?<=(module.exports(\s*)=(\s*){))(.*?)(?=})/gs;
const requiredAnonymous = /((?<=(module.exports(\s*)=))(.*)(?=\())/g;
const requiredDefault = /(?<=\b(module.exports(\s*)=(\s*)))((?!class|function)\w+)/g;

// regex - static
const staticNamedSingle = /(?<=\b(export(\s*)(const|let|var)(\s*)))(\w+)/g;
const staticNamedMulti = /(?<=(export(\s*){))(.*?)(?=})/gs;
const staticAnonymous = /((?<=(export(\s*)default))(.*?)(?=\())/g;
const staticDefault = /(?<=\b(export default(\s*)function(\s*))|(export default(\s*)class(\s*))|(export default(\s*)))((?!class|function)\w+)/g;

// regex - types
const allTypes = /(?<=\b(export(\s*)type(\s*))|(export(\s*)interface(\s*)))(\w+)/g;

const readFile = (filepath) => {
  const content = readFileSync(filepath, "utf8");

  const requiredNamedExports = namedExports(
    content,
    requiredNamedSingle,
    requiredNamedMulti
  );
  const staticNamedExports = namedExports(
    content,
    staticNamedSingle,
    staticNamedMulti
  );

  const requiredAnonymousExports = anonymousExports(
    filepath,
    content,
    requiredAnonymous
  );
  const staticAnonymousExports = anonymousExports(
    filepath,
    content,
    staticAnonymous
  );

  const requiredDefaultExports = defaultExports(
    filepath,
    content,
    requiredDefault
  );
  const staticDefaultExports = defaultExports(filepath, content, staticDefault);

  const allTypeExports = typeExports(content, allTypes);

  return {
    filepath,
    static: {
      named: staticNamedExports,
      anonymous: staticAnonymousExports,
      default: staticDefaultExports,
    },
    required: {
      named: requiredNamedExports,
      anonymous: requiredAnonymousExports,
      default: requiredDefaultExports,
    },
    types: allTypeExports,
  };
};

const sortByFilepath = ({ filepath: filepathA }, { filepath: filepathB }) => {
  const [fileA, fileB] = [filepathA.toLowerCase(), filepathB.toLowerCase()];
  if (fileA < fileB) return -1;
  if (fileA > fileB) return 1;
  return 0;
};

module.exports.getExports = (path, data = []) => {
  const dirItems = readdirSync(path);
  dirItems.forEach((dirItem) => {
    const dirItemPath = `${path}/${dirItem}`;
    const isFile = lstatSync(dirItemPath).isFile();
    if (isFile) {
      // only ready *.ts, *.tsx, *.js, *.jsx files
      if (dirItemPath.match(/\.ts|\.js/g)) {
        data.push(readFile(dirItemPath));
      }
    } else {
      this.getExports(dirItemPath, data);
    }
  });
  return data.sort(sortByFilepath);
};
