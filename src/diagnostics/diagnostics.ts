import * as vscode from 'vscode';
import { LABEL_WITHOUT_UNDERSCORE_PATTERN, LANGUAGE_ID, TARGET_FILE_NAME } from '../common/constants';

export function updateDiagnostics(doc: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
    const labelRegex = LABEL_WITHOUT_UNDERSCORE_PATTERN;
    const diagnosticsList: vscode.Diagnostic[] = [];
    const text = doc.getText();
    let match;

    while ((match = labelRegex.exec(text)) !== null) {
        const fullVarName = match[2];

        if (!fullVarName.startsWith('_')) {
            const startPos: vscode.Position = doc.positionAt(match.index + match[1].length);
            const endPos: vscode.Position = startPos.translate(0, fullVarName.length);
            const range: vscode.Range = new vscode.Range(startPos, endPos);

            const diag = new vscode.Diagnostic(
                range,
                `Label variable "${fullVarName}" should start with an underscore\nUse "_${fullVarName}"`,
                vscode.DiagnosticSeverity.Warning
            );
            vscode.window.showErrorMessage(`Label variable "${fullVarName}" should start with an underscore. Use '_${fullVarName}'`);

            diag.source = 'label-naming';
            diagnosticsList.push(diag);
        }
    }

    collection.set(doc.uri, diagnosticsList);
}

export function diagnosticsHandler(config: vscode.WorkspaceConfiguration) {
    const fileName = config.get<string>('targetFile', TARGET_FILE_NAME);
    
    return (doc: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) => {
        if (doc.languageId === LANGUAGE_ID && doc.uri.fsPath.endsWith(fileName)) {
            updateDiagnostics(doc, diagnostics);
        }
    };
}