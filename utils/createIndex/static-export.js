const { MAX_LINE_LENGTH } = require("../shared");

// export { default as App, Wrapper, Title } from "./..."
module.exports.staticExport = (data, relativePath) => {
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
