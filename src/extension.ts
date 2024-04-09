// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
//   // Use the console to output diagnostic information (console.log) and errors (console.error)
//   // This line of code will only be executed once when your extension is activated
//   console.log(
//     'Congratulations, your extension "vscode-author-pro" is now active!'
//   );

//   // The command has been defined in the package.json file
//   // Now provide the implementation of the command with registerCommand
//   // The commandId parameter must match the command field in package.json
//   let disposable = vscode.commands.registerCommand(
//     "vscode-author-pro.helloWorld",
//     () => {
//       // The code you place here will be executed every time your command is executed
//       // Display a message box to the user
//       vscode.window.showErrorMessage("Hello World from vscode!");
//       console.log("Should show a message box!");
//     }
//   );

//   context.subscriptions.push(disposable);

//   // Execute the command when the extension is activated
//   vscode.commands.executeCommand("vscode-author-pro.helloWorld");
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

// ----------------- TEST -----------------

import * as vscode from "vscode";
// import { getGptCompletion } from "./chatgpt";
import { GptGetter } from "./chatgpt";

const disposable = vscode.commands.registerCommand(
  "vscode-author-pro.helloWorld",
  () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage("Please open a text editor");
      return;
    }

    // console.log("Editor is: ", editor);

    const text = editor.document.getText(); // Get selected textwith editor.selection
    const buffer = Buffer.from(text, "utf-8"); // Get text as utf-8

    console.log("Text is: ", text);
    // console.log("Buffer is: ", buffer);

    vscode.window
      .showInputBox({ prompt: "Enter your command" })
      .then((value) => {
        console.log("Input value is:", value);

        if (!value) {
          vscode.window.showErrorMessage("No input provided");
          return;
        }

        if (value) {
          const command: string = value;
          const prompt = command;
          // const gptGetter = GptGetter.getInst(prompt);
          const gptGetter = GptGetter.getInst("Hello!");

          vscode.window.showErrorMessage("Sending to chatGPT...");

          console.log("Prompt is: ", prompt);

          // Ask chatGPT for completion
          gptGetter
            .getGptCompletion(prompt)
            .then((response) => {
              console.log("Received response from GPT-3 API:", response);

              editor.edit((editBuilder) => {
                // Insert the completion into the editor
                editBuilder.insert(editor.selection.end, "\r\n" + response);
              });
            })
            .catch((error) => {
              console.error("Error calling GPT-3 API:", error);
            });
        }
      });
  }
);
