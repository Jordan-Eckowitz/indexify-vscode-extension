// packages
const { relative } = require("path");
const { writeFileSync, existsSync, unlinkSync } = require("fs");

// utils
const { requiredExport } = require("./required-export");
const { staticExport } = require("./static-export");
const { typeExport } = require("./type-export");

module.exports.createIndex = (path, data, includeIndexFiles) => {
  const { required, static, types } = data.reduce(
    (output, { filepath, static, required, types }) => {
      // if includeIndexFiles = false then exclude exports from nested index files
      if (!includeIndexFiles && filepath.match(/index\.(js|ts)/)) {
        return output;
      }
      const relativePath = `./${relative(path, filepath)}`;
      // if relativePath = "./index.*", i.e. index file at root of selected folder, then exclude
      if (relativePath.match(/\.\/index\./)) {
        return output;
      }
      const requiredFileExport = requiredExport(required, relativePath);
      const staticFileExport = staticExport(static, relativePath);
      const typeFileExport = typeExport(types, relativePath);
      if (requiredFileExport) {
        output.required.imports.push(requiredFileExport.imports);
        output.required.exports.push(...requiredFileExport.exports);
      }
      if (staticFileExport) {
        output.static.push(staticFileExport);
      }
      if (typeFileExport) {
        output.types.push(typeFileExport);
      }
      return output;
    },
    { required: { imports: [], exports: [] }, static: [], types: [] }
  );

  let fileExtension = "js";
  const exports = [];
  const addToExports = (arr) => {
    arr.forEach((exp) => {
      exports.push(exp.replace(/\.(ts|js)(.*?)\"/, '"'));
      // if any files are .ts* then create a index.ts file, otherwise index.js
      if (exp.match(".ts")) fileExtension = "ts";
    });
  };

  const formatRequiredExports = required.exports.reduce(
    (moduleExports, file, idx) => {
      moduleExports += `\n\t${file}`;
      if (idx === required.exports.length - 1) {
        moduleExports += "\n}";
      } else {
        moduleExports += ",";
      }
      return moduleExports;
    },
    "module.exports = {"
  );

  addToExports(required.imports);
  if (required.exports.length > 0) {
    exports.push(formatRequiredExports);
  }
  addToExports(static);
  addToExports(types);

  ["js", "ts"].forEach((ext) => {
    const removePath = `${path}/index.${ext}`;
    if (existsSync(removePath)) {
      unlinkSync(removePath);
    }
  });

  const indexPath = `${path}/index.${fileExtension}`;
  const exportsData = exports.join("\n") + "\n"; // leave empty line at the bottom
  writeFileSync(indexPath, exportsData);
};
