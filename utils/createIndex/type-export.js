const { MAX_LINE_LENGTH } = require("../shared");

// export type {Wrapper, Title} from "./..."
module.exports.typeExport = (data, relativePath) => {
  if (data.length === 0) return null;
  const exportStart = `export type `;
  const fromPath = ` from "${relativePath}"`;

  let middleExport = `{ ${data.join(", ")} }`;
  if ((exportStart + middleExport + fromPath).length > MAX_LINE_LENGTH) {
    middleExport = `{${data.map((name) => `\n\t${name}`).join(",")}\n}`;
  }
  return exportStart + middleExport + fromPath;
};
