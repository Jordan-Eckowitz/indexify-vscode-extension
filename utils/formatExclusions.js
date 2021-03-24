module.exports.formatExclusions = (exclusionsString) => {
  if (exclusionsString.length === 0) return [];
  return exclusionsString.split(",").map((dir) => {
    let val = dir.trim();
    if (val[0] !== "/") val = `/${val}`;
    return val;
  });
};
