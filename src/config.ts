import * as vscode from 'vscode';
import * as path from 'path';

export function getConfig(): vscode.WorkspaceConfiguration {
    const extensionId = 'bc-lbl-handler';
    return vscode.workspace.getConfiguration(extensionId);
}