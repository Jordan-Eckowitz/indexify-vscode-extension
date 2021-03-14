module.exports.getFilename = (filepath) => {
  return filepath.split("/").slice(-1)[0].split(".")[0];
};
