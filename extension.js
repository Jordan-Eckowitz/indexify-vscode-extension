// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");

// utils
const { getExports, createIndex } = require("./utils");

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
  let disposable = vscode.commands.registerCommand(
    "indexify.contextMenu",
    ({ path }) => {
      const exports = getExports(path);
      createIndex(path, exports);

      // Display a message box to the user
      vscode.window.showInformationMessage(path);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
