/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * token-api.js
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use script';
const assert = require('assert');
const ApiToolSingleton = require('./api-tools.js');
const apiTool = ApiToolSingleton.getInstance();
const ModelSingleton = require('./model.js');
const model  = ModelSingleton.getInstance();

exports.getTokenList = async function (filters, params) {
	assert(filters !== undefined);
	assert(params !== undefined);
	const url = 'token/list';
	/* TODO cleanup
	for (const filter of Object.keys(filters)) 
		url.searchParams.append(filter, filters[filter]);
	if (params.resultsPerPage !== undefined)
		url.searchParams.append('resultsPerPage', params.resultsPerPage);
		*/
	params.filters = filters;
	try {
		const result = await apiTool.request(url, 'GET', null, params);
		const tokenList = result.tokenList;
		if (tokenList === undefined)
			throw new Error('Token list not found is HTTP response');
		return {ok: true, tokenList: tokenList};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

exports.getTokenDetails = async function (idToken, params) {
	assert(idToken !== undefined);
	assert(params !== undefined);
	if (isNaN(idToken))
		throw new Error('Argument <idToken> is not a number');
	const url = `token/${idToken}`;
	try {
		const result = await apiTool.request(url, 'GET', null, null);
		const token = result.token;
		if (token === undefined)
			throw new Error('Token not found is HTTP response');
		return {ok: true, token: token};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

