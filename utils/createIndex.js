const { relative } = require("path");

const MAX_LINE_LENGTH = 80; // chars

// export App, {Wrapper, Title} from "./..."
const staticExport = (data, relativePath) => {
  console.log("DATA", data);
  const anonymousOrDefault = [...data.anonymous, ...data.default];
  // if (anonymousOrDefault.length > 1) {
  //   return console.log("ERROR - ONLY ALLOWED ONE ANONYMOUSE/DEFAULT EXPORT PER FILE");
  // }
  const anonymousOrDefaultValue = anonymousOrDefault[0]
    ? `${anonymousOrDefault[0]},`
    : "";
  const exportStart = `export ${anonymousOrDefaultValue}`;
  const fromPath = `from "${relativePath}"`;

  let exportOutput = `${exportStart} {${data.named.join(", ")}} ${fromPath}`;
  if (exportOutput.length > MAX_LINE_LENGTH) {
    exportOutput = `${exportStart} {${data.named
      .map((name) => `\n\t${name}`)
      .join(",")}\n} ${fromPath}`;
  }
  console.log("OUTPUT", exportOutput);
};

module.exports.createIndex = (path, data) => {
  const exports = data.map(({ filepath, static, required, types }) => {
    const relativePath = `./${relative(path, filepath)}`;
    const staticFileExport = staticExport(static, relativePath);
  });

  // TODO: static exports
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
