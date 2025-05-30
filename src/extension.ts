import * as vscode from 'vscode';
import { TARGET_FILE_NAME } from './common/constants';
import { diagnosticsHandler } from './diagnostics/diagnostics';
import { getConfig } from './config';
import { getUriFromFilename } from './utils';
import { getMatchingGroups, getAllLabelVariableNames, getAllProcedureNames, createLabelGetterProcedure, removeProceduresWithoutLabels, removeProcedureByName, getCodeunitSignature, getAllLabelVariables } from './common/parsing';
import { AlProcedureBuilder } from './alObjects/alProcedure';
import { AlCodeunitBuilder } from './alObjects/alCodeunit';

export function updateFileContent(fileContent: string): string {
	const labels = getMatchingGroups(getAllLabelVariableNames(fileContent));
	const existingProcedures = getAllProcedureNames(fileContent);
	var processedFileContent = fileContent;
	processedFileContent = existingProcedures.reduce((acc, procedureName) => removeProcedureByName(acc, procedureName), processedFileContent);
	const codeunitSignature = getCodeunitSignature(fileContent);
	const codeunitBuilder = new AlCodeunitBuilder()
		.withId(codeunitSignature[0])
		.withName(codeunitSignature[1])
		.withVariables(getAllLabelVariables(fileContent));

	const procedures = labels.map(u => {
		return new AlProcedureBuilder()
			.withName(u)
			.withParameters([])
			.withProcedureBlock(`exit(_${u});`)
			.withReturnType('Text')
			.build();
	});

	codeunitBuilder.withProcedures(procedures);

	return codeunitBuilder.build().toString();
}

async function updateLabelRepo(fileUri: vscode.Uri) {
	try {
		const content = await vscode.workspace.fs.readFile(fileUri);
		const text = Buffer.from(content).toString('utf8');
		const newText = updateFileContent(text);

		const edit = new vscode.WorkspaceEdit();
		const document = await vscode.workspace.openTextDocument(fileUri);

		let targetLine = -1;

		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i).text.trim();
			if (/codeunit\s+\d+\s+/g.test(line)) {
				targetLine = i;
				break;
			}
		}

		if (targetLine === -1) {
			vscode.window.showWarningMessage(`No line starting with 'codeunit' found in ${fileUri.fsPath}`);
			return;
		}

		const startPos = new vscode.Position(targetLine, 0);
		const endLine = document.lineCount - 1;
		const endChar = document.lineAt(endLine).text.length;
		const endPos = new vscode.Position(endLine, endChar);

		const fullRange = new vscode.Range(startPos, endPos);

		edit.replace(fileUri, fullRange, newText);
		await vscode.workspace.applyEdit(edit);

		vscode.window.showInformationMessage(`Updated ${fileUri.fsPath}`);
	}
	catch (err) {
		vscode.window.showErrorMessage(`Failed to process ${fileUri.fsPath}: ${err}`);
	}
}

async function onUpdateLabelRepoCommand(config: vscode.WorkspaceConfiguration) {
	const fileName = config.get<string>('targetFile', TARGET_FILE_NAME);
	const documentUri = await getUriFromFilename(fileName);

	if (!documentUri) {
		vscode.window.showErrorMessage(`Could not find any file named "${fileName}" in this workspace.`);
		return;
	}

	if (fileName !== TARGET_FILE_NAME) {
		vscode.window.showWarningMessage(`This only works on '${TARGET_FILE_NAME}'.`);
		return;
	}

	const editor = await vscode.window.showTextDocument(documentUri);
	await updateLabelRepo(documentUri);
}

export function activate(context: vscode.ExtensionContext) {
	const contribution: vscode.WorkspaceConfiguration = getConfig();
	const updateLabelGetters = vscode.commands.registerCommand(
		'bc-lbl-handler.updateLabelGetters',
		async () => await onUpdateLabelRepoCommand(contribution)
	);
	const diagnostics = vscode.languages.createDiagnosticCollection('al-label-naming');
	const handleDiagnostics = diagnosticsHandler(contribution);
	context.subscriptions.push(updateLabelGetters);
	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument(document => handleDiagnostics(document, diagnostics)),
		vscode.workspace.onDidChangeTextDocument(ev => handleDiagnostics(ev.document, diagnostics)),
		diagnostics
	);
}

export function deactivate() {
	console.log('[BC-LBL] deactivate');
}