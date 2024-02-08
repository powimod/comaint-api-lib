/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * unit-api.js
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

exports.getUnitList = async function (filters, params) {
	assert(filters !== undefined);
	assert(params !== undefined);
	const url = 'unit/list';
	/* TODO cleanup
	for (const filter of Object.keys(filters)) 
		url.searchParams.append(filter, filters[filter]);
	if (params.resultsPerPage !== undefined)
		url.searchParams.append('resultsPerPage', params.resultsPerPage);
		*/
	params.filters = filters;
	try {
		const result = await apiTool.request(url, 'GET', null, params);
		const unitList = result.unitList;
		if (unitList === undefined)
			throw new Error('Unit list not found is HTTP response');
		return {ok: true, unitList: unitList};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

exports.getUnitDetails = async function (idUnit, params) {
	assert(idUnit !== undefined);
	assert(params !== undefined);
	if (isNaN(idUnit))
		throw new Error('Argument <idUnit> is not a number');
	const url = `unit/${idUnit}`;
	try {
		const result = await apiTool.request(url, 'GET', null, null);
		const unit = result.unit;
		if (unit === undefined)
			throw new Error('Unit not found is HTTP response');
		return {ok: true, unit: unit};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

