// packages
const uniq = require("lodash.uniq");

module.exports.namedExports = (content) => {
  console.log(content);
  const singleNamedExport = content.match(/(?<=\b(exports.))(\w+)/g) || [];
  const multi = content.match(/(?<=(module.exports(\s*)=(\s*){))(.*?)(?=})/gs);
  const multiNamedExport = multi
    ? multi
        .map((str) => {
          if (str.match(",")) {
            return str.split(",").map((exp) => exp.trim());
          }
          return str;
        })
        .flat()
        .filter((item) => item.length > 0)
    : [];
  const output = uniq([...singleNamedExport, ...multiNamedExport]);
  console.log("OUTPUT", output);
};
