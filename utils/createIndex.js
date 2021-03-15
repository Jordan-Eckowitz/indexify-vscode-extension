const { relative } = require("path");

module.exports.createIndex = (path, data) => {
  const exports = data.map((file) => ({
    ...file,
    relativePath: `./${relative(path, file.filepath)}`,
  }));
  console.log("EXPORTS", exports);
};
