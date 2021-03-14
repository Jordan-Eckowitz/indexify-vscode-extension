const { getFilename } = require("./shared");

module.exports.anonymousExports = (filepath, content, regex) => {
  const exports = content.match(regex) || [];
  const hasAnonymousExports = exports.some((item) => {
    const trimmedItem = item.trim();
    return trimmedItem === "function" || trimmedItem === "";
  });

  if (hasAnonymousExports) return [getFilename(filepath)];
  return [];
};
