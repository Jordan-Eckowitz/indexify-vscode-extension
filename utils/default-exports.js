module.exports.defaultExports = (content, regex) => {
  return content.match(regex) || [];
};
