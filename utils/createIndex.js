const { relative } = require("path");
const { writeFileSync, existsSync, unlinkSync } = require("fs");

const MAX_LINE_LENGTH = 80; // chars

// const App, { Wrapper, Title } = require("./...")
// module.exports = {...}
const requiredExport = (data, relativePath) => {
  const anonymousOrDefault = [...data.anonymous, ...data.default];
  const allExports = [...anonymousOrDefault, ...data.named];
  if (allExports.length === 0) return null;
  const anonymousOrDefaultValue = anonymousOrDefault[0] || "";
  let exportStart = `const ${anonymousOrDefaultValue}`;
  const fromPath = ` = require("${relativePath}")`;

  let middleExport = "";
  if (data.named.length > 0) {
    if (anonymousOrDefaultValue.length > 0) {
      exportStart += ", ";
    }
    middleExport = `{ ${data.named.join(", ")} }`;
    if ((exportStart + middleExport + fromPath).length > MAX_LINE_LENGTH) {
      middleExport = `{${data.named.map((name) => `\n\t${name}`).join(",")}\n}`;
    }
  }
  return {
    imports: exportStart + middleExport + fromPath,
    exports: [...anonymousOrDefault, ...data.named],
  };
};

// export { default as App, Wrapper, Title } from "./..."
const staticExport = (data, relativePath) => {
  const anonymousOrDefault = [...data.anonymous, ...data.default];
  const allExports = [...anonymousOrDefault, ...data.named];
  if (allExports.length === 0) return null;
  let anonymousOrDefaultValue = "{";
  if (anonymousOrDefault[0]) {
    anonymousOrDefaultValue = `{ default as ${anonymousOrDefault[0]}`;
  }
  let exportStart = `export ${anonymousOrDefaultValue}`;
  const fromPath = ` from "${relativePath}"`;

  let middleExport = " }";
  if (data.named.length > 0) {
    if (anonymousOrDefaultValue.length > 1) {
      exportStart += ",";
    }
    middleExport = ` ${data.named.join(", ")} }`;
    if ((exportStart + middleExport + fromPath).length > MAX_LINE_LENGTH) {
      middleExport = `${data.named.map((name) => `\n\t${name}`).join(",")}\n}`;
      // for multi-line export need to move "default as ..." onto a new, tabbed line
      exportStart = exportStart.replace("default as", "\n\tdefault as");
    }
  }
  return exportStart + middleExport + fromPath;
};

// export type {Wrapper, Title} from "./..."
const typeExport = (data, relativePath) => {
  if (data.length === 0) return null;
  const exportStart = `export type `;
  const fromPath = ` from "${relativePath}"`;

  let middleExport = `{ ${data.join(", ")} }`;
  if ((exportStart + middleExport + fromPath).length > MAX_LINE_LENGTH) {
    middleExport = `{${data.map((name) => `\n\t${name}`).join(",")}\n}`;
  }
  return exportStart + middleExport + fromPath;
};

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
  const addToExports = (arr) =>
    arr.forEach((exp) => {
      exports.push(exp.replace(/\.(ts|js)(.*?)\"/, '"'));
      // if any files are .ts* then create a index.ts file, otherwise index.js
      if (exp.match(".ts")) fileExtension = "ts";
    });

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
