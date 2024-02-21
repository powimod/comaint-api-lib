/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * nomenclature-api.js
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

const getNomenclatureList = async function (filters, params) {
	const url = `${apiVersion}/nomenclature/list`
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
		const nomenclatureList = result.nomenclatureList
		if (nomenclatureList === undefined)
			throw new Error('Nomenclature list not found is HTTP response')
		return {ok: true, nomenclatureList: nomenclatureList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getNomenclatureDetails = async function (idNomenclature, params) {
	if (isNaN(idNomenclature))
		throw new Error('Argument <idNomenclature> is not a number')
	const url = `${apiVersion}/nomenclature/${idNomenclature}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const nomenclature = result.nomenclature
		if (nomenclature === undefined)
			throw new Error('Nomenclature not found is HTTP response')
		return {ok: true, nomenclature: nomenclature}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editNomenclature = async function (nomenclature) {
	if (typeof(nomenclature) !== 'object')
		throw new Error('Argument <nomenclature> is not an object')
	const url = `${apiVersion}/nomenclature/edit`
	try {
		const result = await apiTool.request(url, 'POST', { nomenclature }, null)
		nomenclature = result.nomenclature
		if (nomenclature === undefined)
			throw new Error('Nomenclature not found is HTTP response')
		return {ok: true, nomenclature: nomenclature}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const nomenclatureApi = {
	getNomenclatureList,
	getNomenclatureDetails,
	editNomenclature 
}
export default nomenclatureApi
