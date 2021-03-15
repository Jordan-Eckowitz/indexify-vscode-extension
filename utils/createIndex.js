const { relative } = require("path");

const MAX_LINE_LENGTH = 80; // chars

// export App, {Wrapper, Title} from "./..."
const staticExport = (data, relativePath) => {
  console.log("DATA", data);
  const anonymousOrDefault = [...data.anonymous, ...data.default];
  // if (anonymousOrDefault.length > 1) {
  //   return console.log("ERROR - ONLY ALLOWED ONE ANONYMOUSE/DEFAULT EXPORT PER FILE");
  // }
  const anonymousOrDefaultValue = anonymousOrDefault[0] || "";
  let exportStart = `export ${anonymousOrDefaultValue}`;
  const fromPath = ` from "${relativePath}"`;

  let middleExport = "";
  if (data.named.length > 0) {
    if (anonymousOrDefaultValue.length > 0) exportStart += ", ";
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
    console.log("STATIC", staticFileExport);
  });
  // TODO: required exports
  // TODO: type exports
};

// return {
//   filepath,
//   static: {
//     named: staticNamedExports,
//     anonymous: staticAnonymousExports,
//     default: staticDefaultExports,
//   },
//   required: {
//     named: requiredNamedExports,
//     anonymous: requiredAnonymousExports,
//     default: requiredDefaultExports,
//   },
//   types: allTypeExports,
// }
