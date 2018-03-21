/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import 'mocha';
import * as assert from 'assert';
import * as path from 'path';
// import Uri from 'vscode-uri';
import { TextDocument, CompletionList, CompletionItemKind } from 'vscode-languageserver-types';
import { getLanguageModes } from '../modes/languageModes';
import { getPathCompletionParticipant } from '../modes/pathCompletion';
import { WorkspaceFolder } from 'vscode-languageserver';

export interface ItemDescription {
	label: string;
	documentation?: string;
	kind?: CompletionItemKind;
	resultText?: string;
	command?: { title: string, command: string };
	notAvailable?: boolean;
}

export function assertCompletion (completions: CompletionList, expected: ItemDescription, document: TextDocument, offset: number) {
	let matches = completions.items.filter(completion => {
		return completion.label === expected.label;
	});
	if (expected.notAvailable) {
		assert.equal(matches.length, 0, `${expected.label} should not existing is results`);
		return;
	}

	assert.equal(matches.length, 1, `${expected.label} should only existing once: Actual: ${completions.items.map(c => c.label).join(', ')}`);
	let match = matches[0];
	if (expected.documentation) {
		assert.equal(match.documentation, expected.documentation);
	}
	if (expected.kind) {
		assert.equal(match.kind, expected.kind);
	}
	if (expected.resultText && match.textEdit) {
		assert.equal(TextDocument.applyEdits(document, [match.textEdit]), expected.resultText);
	}
	if (expected.command) {
		assert.deepEqual(match.command, expected.command);
	}
}

const testUri = 'test://test/test.html';

export function testCompletionFor(
	value: string,
	expected: { count?: number, items?: ItemDescription[] },
	uri = testUri,
	workspaceFolders?: WorkspaceFolder[]
): void {
	let offset = value.indexOf('|');
	value = value.substr(0, offset) + value.substr(offset + 1);

	let document = TextDocument.create(uri, 'html', 0, value);
	let position = document.positionAt(offset);

	var languageModes = getLanguageModes({ css: true, javascript: true });
	var mode = languageModes.getModeAtPosition(document, position)!;

	if (!workspaceFolders) {
		workspaceFolders = [{ name: 'x', uri: path.dirname(uri) }];
	}

	let participantResult = CompletionList.create([]);
	if (mode.setCompletionParticipants) {
		mode.setCompletionParticipants([getPathCompletionParticipant(document, workspaceFolders, participantResult)]);
	}

	let list = mode.doComplete!(document, position)!;
	list.items = list.items.concat(participantResult.items);

	if (expected.count) {
		assert.equal(list.items, expected.count);
	}
	if (expected.items) {
		for (let item of expected.items) {
			assertCompletion(list, item, document, offset);
		}
	}
}

suite('HTML Completion', () => {
	test('HTML Javascript Completions', function (): any {
		testCompletionFor('<html><script>window.|</script></html>', {
			items: [
				{ label: 'location', resultText: '<html><script>window.location</script></html>' },
			]
		});
		testCompletionFor('<html><script>$.|</script></html>', {
			items: [
				{ label: 'getJSON', resultText: '<html><script>$.getJSON</script></html>' },
			]
		});
	});
});

suite('HTML Path Completion', () => {
	const triggerSuggestCommand = {
		title: 'Suggest',
		command: 'editor.action.triggerSuggest'
	};

	const fixtureRoot = path.resolve(__dirname, 'pathcompletionfixtures');
	const fixtureWorkspace = { name: 'fixture', uri: fixtureRoot };
	const indexHtmlUri = path.resolve(fixtureRoot, 'index.html');
	const aboutHtmlUri = path.resolve(fixtureRoot, 'about/about.html');

	test('Basics - Correct label/kind/result/command', () => {
		testCompletionFor('<script src="./|">', {
			items: [
				{ label: 'about/', kind: CompletionItemKind.Folder, resultText: '<script src="./about/">', command: triggerSuggestCommand },
				{ label: 'index.html', kind: CompletionItemKind.File, resultText: '<script src="./index.html">' },
				{ label: 'src/', kind: CompletionItemKind.Folder, resultText: '<script src="./src/">', command: triggerSuggestCommand }
			]
		}, indexHtmlUri);
	});

	test('Basics - Single Quote', () => {
		testCompletionFor(`<script src='./|'>`, {
			items: [
				{ label: 'about/', kind: CompletionItemKind.Folder, resultText: `<script src='./about/'>`, command: triggerSuggestCommand },
				{ label: 'index.html', kind: CompletionItemKind.File, resultText: `<script src='./index.html'>` },
				{ label: 'src/', kind: CompletionItemKind.Folder, resultText: `<script src='./src/'>`, command: triggerSuggestCommand }
			]
		}, indexHtmlUri);
	});

	test('No completion for remote paths', () => {
		testCompletionFor('<script src="http:">', { items: [] });
		testCompletionFor('<script src="http:/|">', { items: [] });
		testCompletionFor('<script src="http://|">', { items: [] });
		testCompletionFor('<script src="https:|">', { items: [] });
		testCompletionFor('<script src="https:/|">', { items: [] });
		testCompletionFor('<script src="https://|">', { items: [] });
		testCompletionFor('<script src="//|">', { items: [] });
	});

	test('Relative Path', () => {
		testCompletionFor('<script src="../|">', {
			items: [
				{ label: 'about/', resultText: '<script src="../about/">' },
				{ label: 'index.html', resultText: '<script src="../index.html">' },
				{ label: 'src/', resultText: '<script src="../src/">' }
			]
		}, aboutHtmlUri);

		testCompletionFor('<script src="../src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="../src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="../src/test.js">' },
			]
		}, aboutHtmlUri);
	});

	test('Absolute Path', () => {
		testCompletionFor('<script src="/|">', {
			items: [
				{ label: 'about/', resultText: '<script src="/about/">' },
				{ label: 'index.html', resultText: '<script src="/index.html">' },
				{ label: 'src/', resultText: '<script src="/src/">' },
			]
		}, indexHtmlUri);

		testCompletionFor('<script src="/src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="/src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="/src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});

	test('Empty Path Value', () => {
		testCompletionFor('<script src="|">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri);
	});

	test('Incomplete Path', () => {
		testCompletionFor('<script src="/src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="/src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="/src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);

		testCompletionFor('<script src="../src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="../src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="../src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});

	test('No leading dot or slash', () => {
		testCompletionFor('<script src="s|">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		testCompletionFor('<script src="src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		testCompletionFor('<script src="src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);
	});

	test('Trigger completion in middle of path', () => {
		testCompletionFor('<script src="src/f|eature.js">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		testCompletionFor('<script src="s|rc/feature.js">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);
	});

	test('Trigger completion in middle of path and with whitespaces', () => {
		testCompletionFor('<script src="./| about/about.html>', {
			items: [
				{ label: 'about/', resultText: '<script src="./about/ about/about.html>' },
				{ label: 'index.html', resultText: '<script src="./index.html about/about.html>' },
				{ label: 'src/', resultText: '<script src="./src/ about/about.html>' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		testCompletionFor('<script src="./a|bout /about.html>', {
			items: [
				{ label: 'about/', resultText: '<script src="./about/ /about.html>' },
				{ label: 'index.html', resultText: '<script src="./index.html /about.html>' },
				{ label: 'src/', resultText: '<script src="./src/ /about.html>' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);
	});

	test('Unquoted Path', () => {
		/* Unquoted value is not supported in html language service yet
		testCompletionFor(`<div><a href=about/|>`, {
			items: [
				{ label: 'about.html', resultText: `<div><a href=about/about.html>` }
			]
		}, testUri);
		*/
	});
});
