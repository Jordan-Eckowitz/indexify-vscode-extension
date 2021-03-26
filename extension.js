// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");

// utils
const { getExports, createIndex, formatExclusions } = require("./utils");

const indexify = (path, includeNestedDirectories) => {
  const config = vscode.workspace.getConfiguration("indexify");
  const exclusions = formatExclusions(config.get("exclude.directoryList"));
  const includeIndexFiles = config.get("include.otherIndexFiles");

  const exports = getExports(path, exclusions, includeNestedDirectories);
  createIndex(path, exports, includeIndexFiles);

  const rootDir = path.split("/").slice(-1);

  // Display a message box to the user
  vscode.window.showInformationMessage(
    `index file created in "${rootDir}" directory`
  );
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "indexify" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const indexifyDeep = vscode.commands.registerCommand(
    "indexify.contextMenu.deep",
    ({ path }) => indexify(path, true)
  );

  const indexifyShallow = vscode.commands.registerCommand(
    "indexify.contextMenu.shallow",
    ({ path }) => indexify(path, false)
  );

  context.subscriptions.push(indexifyDeep);
  context.subscriptions.push(indexifyShallow);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
