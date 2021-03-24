const { relative } = require("path");

const MAX_LINE_LENGTH = 80; // chars

// const App, {Wrapper, Title} = require("./...")
// module.exports = {...}
const requiredExport = (data, relativePath) => {
  console.log("DATA", data);
  const anonymousOrDefault = [...data.anonymous, ...data.default];
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

// export App, {Wrapper, Title} from "./..."
const staticExport = (data, relativePath) => {
  const anonymousOrDefault = [...data.anonymous, ...data.default];
  const anonymousOrDefaultValue = anonymousOrDefault[0] || "";
  let exportStart = `export ${anonymousOrDefaultValue}`;
  const fromPath = ` from "${relativePath}"`;

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
  return exportStart + middleExport + fromPath;
};

module.exports.createIndex = (path, data) => {
  const exports = data.map(({ filepath, static, required, types }) => {
    const relativePath = `./${relative(path, filepath)}`;
    const staticFileExport = staticExport(static, relativePath);
    const requiredFileExport = requiredExport(required, relativePath);
    console.log(requiredFileExport);
  });
};
