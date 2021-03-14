const { getFilename } = require("../shared");

module.exports.defaultExports = (filepath, content, regex) => {
  const hasDefault = content.match(regex);
  if (hasDefault) return [getFilename(filepath)];
  return [];
};
