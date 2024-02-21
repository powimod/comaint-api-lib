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

'use script'
import ApiToolsSingleton from './api-tools'
const apiTool = ApiToolsSingleton.getInstance()
const apiVersion = 'v1'

const getUnitList = async function (filters, params) {
	const url = `${apiVersion}/unit/list`
	if (! params)
		params = {}
	/* TODO cleanup
	for (const filter of Object.keys(filters)) 
		url.searchParams.append(filter, filters[filter])
	if (params.resultsPerPage !== undefined)
		url.searchParams.append('resultsPerPage', params.resultsPerPage)
		*/
	params.filters = filters
	try {
		const result = await apiTool.request(url, 'GET', null, params)
		const unitList = result.unitList
		if (unitList === undefined)
			throw new Error('Unit list not found is HTTP response')
		return {ok: true, unitList: unitList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getUnitDetails = async function (idUnit, params) {
	if (isNaN(idUnit))
		throw new Error('Argument <idUnit> is not a number')
	const url = `${apiVersion}/unit/${idUnit}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const unit = result.unit
		if (unit === undefined)
			throw new Error('Unit not found is HTTP response')
		return {ok: true, unit: unit}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editUnit = async function (unit) {
	if (typeof(unit) !== 'object')
		throw new Error('Argument <unit> is not an object')
	const url = `${apiVersion}/unit/edit`
	try {
		const result = await apiTool.request(url, 'POST', { unit }, null)
		unit = result.unit
		if (unit === undefined)
			throw new Error('Unit not found is HTTP response')
		return {ok: true, unit: unit}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const unitApi = {
	getUnitList,
	getUnitDetails,
	editUnit 
}
export default unitApi
