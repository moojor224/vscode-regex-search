import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
    const file = "tasklist.py";
    console.log("file", file);
    console.log(vscode.workspace.workspaceFolders);
    let searchFiles: string[] = [];
    let curId = 0;
    vscode.workspace.workspaceFolders?.forEach(function (folder, index, array) {
        let { uri } = folder;
        let vscodePath = path.join(uri.fsPath, ".vscode");
        if (fs.existsSync(vscodePath)) {
            let jsonPath = path.join(vscodePath, "search.json");
            fs.watch(vscodePath, { recursive: false }, (eventType, filename) => {
                console.log("watch event", eventType, filename);
                if (eventType === "change" && filename === "search.json") {
                    console.log("updated saved regexs");
                }
            });
            if (fs.existsSync(jsonPath)) {
                let jsonContents = fs.readFileSync(jsonPath, "utf8");
                let json: string;
                try {
                    json = JSON.parse(jsonContents);
                } catch (e) {
                    console.error(e);
                    return;
                }
                let entries: [string, string][] = Object.entries(json);
                let searches = entries.map(([key, value]) => ({ key, value: new RegExp(value) }));
            }
        }
    });
    vscode.workspace.fs.stat(vscode.Uri.file("")).then(e => {
        console.log(e);
    });
    vscode.window.showInformationMessage('search  extension activated');
    let search = vscode.commands.registerCommand("vscode-regex-search.search", function (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    });

    context.subscriptions.push(search);
}

export function deactivate() { }
