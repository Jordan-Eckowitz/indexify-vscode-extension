module.exports.typeExports = (content, regex) => {
  return content.match(regex) || [];
};
