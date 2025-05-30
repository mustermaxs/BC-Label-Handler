import * as vscode from 'vscode';

export async function getUriFromFilename(filename: string): Promise<vscode.Uri | undefined> {
  const matches = await vscode.workspace.findFiles(
    `**/${filename}`,
    `**/node_modules/**`,
    10
  );

  if (matches.length === 0) {
    return undefined;
  }

  if (matches.length === 1) {
    return matches[0];
  }

  const items = matches.map(uri => ({
    label: uri.path.split('/').pop() || uri.fsPath,
    description: uri.fsPath,
    uri
  }));

  const pick = await vscode.window.showQuickPick(items, {
    placeHolder: `Multiple "${filename}" files found - pick one`
  });

  return pick?.uri;
}
