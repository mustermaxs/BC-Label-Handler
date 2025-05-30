import * as vscode from 'vscode';
import { LABEL_VARIABLE_PATTERN, unprocessedLabelPattern, END_OF_LINE_PATTERN, PROCEDURE_NAME_PATTERN, procedurePatternWithName, CODEUNIT_SIGNATURE_PATTERN, LABEL_PATTERN } from "./constants";

export function getAllLabelVariableNames(fileContent: string): IterableIterator<RegExpExecArray> {
    return fileContent.matchAll(LABEL_VARIABLE_PATTERN);
}

export function getAllLabelVariables(fileContent: string): string[] {
    return getMatchingGroups(fileContent.matchAll(LABEL_PATTERN));
}

export function getUnprocessedLabels(fileContent: string, labelVariables: string[]): string[] {
    const pattern = unprocessedLabelPattern(labelVariables);
    const matches = fileContent.matchAll(pattern);
    const matchingGroups = getMatchingGroups(matches);
    return labelVariables.filter(variable => !matchingGroups.includes(variable));
}

export function getMatchingGroups(matches: IterableIterator<RegExpExecArray>): string[] {
    const result: string[] = [];
    for (const match of matches) {
        if (match[1]) {
            result.push(match[1]);
        }
    }
    return result;
}

export function getCodeunitSignature(fileContent: string): [number, string] {
    const match = fileContent.match(CODEUNIT_SIGNATURE_PATTERN);
    if (match) {
        return [Number(match[1]), match[2].trim()];
    }
    throw new Error('Codeunit signature not found');
}

export function createLabelGetterProcedure(labelVariableName: string): string {
    return `\tprocedure ${labelVariableName}(): Text\n\tbegin\n\t\texit(_${labelVariableName});\n\tend;`;
}

export function findEndOfFile(fileContent: string): number {
    const lines = fileContent.matchAll(END_OF_LINE_PATTERN);
    let lineCount = 0;
    for (const line of lines) {
        lineCount++;
    }
    return lineCount;
}

export function getAllProcedureNames(fileContent: string): string[] {
    return getMatchingGroups(fileContent.matchAll(PROCEDURE_NAME_PATTERN));
}

export function getProcedureNamesWithoutLabels(fileContent: string, labelVariables: string[]): string[] {
    const allProcedureNames = getMatchingGroups(fileContent.matchAll(PROCEDURE_NAME_PATTERN));
    return allProcedureNames.filter(name => !labelVariables.includes(`${name}`));
}

export function removeProcedureByName(fileContent: string, procedureName: string): string {
    return fileContent.replace(procedurePatternWithName(procedureName), '\n\n\n');
}

export function removeProceduresWithoutLabels(fileContent: string, procedures: string[], labelVariables: string[]): string {
    const procedureNamesWithoutLabels = getProcedureNamesWithoutLabels(fileContent, labelVariables);
    procedureNamesWithoutLabels.forEach(procedure => console.log(`Removing ${procedure}`));
    return procedureNamesWithoutLabels.reduce((acc, procedureName) => removeProcedureByName(acc, procedureName), fileContent)
        .replace(/\s*\}/, '\n}');
}