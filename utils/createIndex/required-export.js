const { MAX_LINE_LENGTH } = require("../shared");

// const App, { Wrapper, Title } = require("./...")
// module.exports = {...}
module.exports.requiredExport = (data, relativePath) => {
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
