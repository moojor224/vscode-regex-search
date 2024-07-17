import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const decoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgb(255, 255, 0)",
        color: "black",
        overviewRulerColor: "blue",
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
    let search = vscode.commands.registerCommand("vscode-regex-search.search", function (_editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) { return; }
        function convertMatchToRange(match: RegExpMatchArray): vscode.Range {
            let start = match.index;
            if (start === undefined) { start = 0; }
            let end = start + match[0].length;
            let startPos = editor?.document.positionAt(start) || new vscode.Position(0, 0);
            let endPos = editor?.document.positionAt(end) || new vscode.Position(0, 0);
            return new vscode.Range(startPos, endPos);
        }
        editor.setDecorations(vscode.window.createTextEditorDecorationType({}), []);
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) { return; }
        const { searches }: {
            searches: RegexSearch[],
        } = vscode.workspace.getConfiguration("vscodeRegexSearch") as unknown as {
            searches: RegexSearch[],
        };
        vscode.window.showQuickPick([{
            name: "Clear All Highlights",
            description: "Clear all highlights",
            pattern: "",
        }, ...searches,].map((e: RegexSearch) => ({
            label: e.name,
            description: e.description,
            detail: e.pattern,
        })), {
            canPickMany: false,
        }).then((value: {
            label: string,
            description: string,
            detail: string,
        } | undefined) => {
            if (value === undefined) { return; }
            const { detail: pattern } = value;
            let regex: RegExp;
            try {
                regex = new RegExp(pattern || " ^", "g");
            } catch (err: any) {
                vscode.window.showErrorMessage("Invalid regex pattern:" + err.message);
                return;
            }
            let content = editor.document.getText();
            let matches = [...content.matchAll(regex)];
            let ranges: vscode.Range[] = matches.map(e => convertMatchToRange(e));
            editor.setDecorations(decoration, ranges);
        });
    });

    context.subscriptions.push(search);
}

export function deactivate() { }
