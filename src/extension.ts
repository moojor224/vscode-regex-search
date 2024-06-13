import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let search = vscode.commands.registerCommand("search", function (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    });

    context.subscriptions.push(search);
}

export function deactivate() { }
