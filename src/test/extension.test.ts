import * as assert from 'assert';
import { getAllLabelVariableNames, getMatchingGroups, createLabelGetterProcedure, getUnprocessedLabels, removeProcedureByName, getProcedureNamesWithoutLabels, getAllProcedureNames, getCodeunitSignature } from '../common/parsing';

function normalize(str: string): string {
	return str
		.replace(/\r\n/g, '\n')
		.replace(/\t/g, ' ')
		.replace(/ +/g, ' ')
		.replace(/\n{2,}/g, '\n')
		.trim();
}

suite('Label Parsing Tests', () => {
	test('Should extract label variable names correctly', () => {
		const input = `
			var
				_CustomerLbl: Label 'Customer';
				_AddressLbl: Label 'Address';
				_SomeErrorTxt: Label 'Error!';
		`;
		const matches = getAllLabelVariableNames(input);
		const result = getMatchingGroups(matches);
		assert.deepStrictEqual(result, ['CustomerLbl', 'AddressLbl', 'SomeErrorTxt']);
	});

	test('Should generate correct procedure string', () => {
		const output = createLabelGetterProcedure('CustomerLbl');
		const expected = '\tprocedure CustomerLbl(): Text\n\tbegin\n\t\texit(_CustomerLbl);\n\tend;';
		assert.equal(output, expected);
	});

	test('Should find unprocessed labels correctly', () => {
		const input = `
			var
				_CustomerLbl: Label 'Customer';
				_AddressLbl: Label 'Address';
				_SomeErrorTxt: Label 'Error!';

			procedure SomeErrorTxt(): Text
			begin
				exit(_SomeErrorTxt);
			end;
		`;
		const allVariables = getMatchingGroups(getAllLabelVariableNames(input));
		const unprocessed = getUnprocessedLabels(input, allVariables);
		assert.deepStrictEqual(unprocessed, ['CustomerLbl', 'AddressLbl']);
	});

	test('Removes procedure by name', () => {
		const input = `
			procedure SomeErrorTxt(): Text
			begin
				exit(_SomeErrorTxt);
			end;
		`;
		assert.equal(removeProcedureByName(input, 'SomeErrorTxt').trim(), '');
	});

	test('Gets procedures without labels', () => {
		const input = `
			var
				_CustomerLbl: Label 'Customer';
				_AddressLbl: Label 'Address';

			procedure SomeErrorTxt(): Text
			begin
				exit(_SomeErrorTxt);
			end;
		`;

		assert.equal(getProcedureNamesWithoutLabels(input, ['CustomerLbl', 'AddressLbl']).length, 1);
	});

	test('Removes procedures without labels', () => {
		const input = `
			var
				_CustomerLbl: Label 'Customer';
				_AddressLbl: Label 'Address';

			procedure SomeErrorTxt(): Text
			begin
				exit(_SomeErrorTxt);
			end;
		`;
		
		const res = removeProcedureByName(input, 'SomeErrorTxt');
		const procedures = getAllProcedureNames(res);
		assert.equal(procedures.length, 0);
	});

	test('CODEUNIT_SIGNATURE_PATTERN matches codeunit signature', () => {
		const input = `
			codeunit 80150 MyCodeunit
		`;
		const res = getCodeunitSignature(input);

		assert.equal(res?.length, 2);
		assert.equal(res?.[0], 80150);
		assert.equal(res?.[1], 'MyCodeunit');
	});
});
