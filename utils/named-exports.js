// packages
const uniq = require("lodash.uniq");

module.exports.namedExports = (content, singleRegex, multiRegex) => {
  const singleNamedExport = content.match(singleRegex) || [];
  const multi = content.match(multiRegex);
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
  return uniq([...singleNamedExport, ...multiNamedExport]);
};
