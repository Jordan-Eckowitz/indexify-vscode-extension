module.exports.getFilename = (filepath) => {
  const fileName = filepath.split("/").slice(-1)[0].split(".")[0];
  // if file name is index then use the name of the parent directory
  if (fileName === "index") {
    return filepath.split("/").slice(-2)[0];
  }
  return fileName;
};
