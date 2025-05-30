export const LANGUAGE_ID = 'al';
export const TARGET_FILE_NAME = 'LblRepo.codeunit.al';
export const CODEUNIT_SIGNATURE_PATTERN = /codeunit\s+(\d+)\s+(["\w+\s*"]+)/;
export const END_OF_LINE_PATTERN = /\}\s*$/g;
export const LABEL_VARIABLE_PATTERN = /_([a-zA-Z_0-9]+).*:\sLabel/g;
export const PROCEDURE_PATTERN = /procedure\s+\w+\s*\([^)]*\)\s*:\s*\w+\s*begin\s*[\s\S]*?end;/g;
export const LABEL_WITHOUT_UNDERSCORE_PATTERN = /^(\s*)([A-Za-z][A-Za-z0-9_]*)\s*:\s*Label\b.*;/gm;
export const LABEL_PATTERN = /(_[\w]+\s*:\s*Label.*;$)/gm;
export const PROCEDURE_NAME_PATTERN = /procedure\s+(\w+)/g;
export const unprocessedLabelPattern = (labelVariables: string[]) => {
	return new RegExp(`procedure\\s+(${labelVariables.join('|')})\\(\\)`, 'g');
};
export const procedurePatternWithName = (name: string) =>
  new RegExp(`\\s*procedure\\s+${name}\\s*\\(\\)\\s*:\\s*\\w+[\\s\\S]*?\\bend;\\s*`,'g');