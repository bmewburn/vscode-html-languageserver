/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join, basename, dirname } from 'path';
import { readFileSync } from 'fs';

const contents: { [name: string]: string } = {};

const isPacked = basename(__dirname) === 'lib';
const serverFolder = isPacked ? __dirname : dirname(dirname(__dirname));
const TYPESCRIPT_LIB_SOURCE = isPacked ? serverFolder : join(serverFolder, 'node_modules/typescript/lib');
const JQUERY_PATH = isPacked ? join(serverFolder, 'jquery.d.ts') : join(serverFolder, 'lib/jquery.d.ts');

export function loadLibrary(name: string) {
	let content = contents[name];
	if (typeof content !== 'string') {
		let libPath;
		if (name === 'jquery') {
			libPath = JQUERY_PATH;
		} else {
			libPath = join(TYPESCRIPT_LIB_SOURCE, name); // from source
		}
		try {
			content = readFileSync(libPath).toString();
		} catch (e) {
			console.log(`Unable to load library ${name} at ${libPath}: ${e.message}`);
			content = '';
		}
		contents[name] = content;
	}
	return content;
}
