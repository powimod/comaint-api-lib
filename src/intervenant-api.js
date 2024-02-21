/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * intervenant-api.js
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

const getIntervenantList = async function (filters, params) {
	const url = `${apiVersion}/intervenant/list`
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
		const intervenantList = result.intervenantList
		if (intervenantList === undefined)
			throw new Error('Intervenant list not found is HTTP response')
		return {ok: true, intervenantList: intervenantList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getIntervenantDetails = async function (idIntervenant, params) {
	if (isNaN(idIntervenant))
		throw new Error('Argument <idIntervenant> is not a number')
	const url = `${apiVersion}/intervenant/${idIntervenant}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const intervenant = result.intervenant
		if (intervenant === undefined)
			throw new Error('Intervenant not found is HTTP response')
		return {ok: true, intervenant: intervenant}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editIntervenant = async function (intervenant) {
	if (typeof(intervenant) !== 'object')
		throw new Error('Argument <intervenant> is not an object')
	const url = `${apiVersion}/intervenant/edit`
	try {
		const result = await apiTool.request(url, 'POST', { intervenant }, null)
		intervenant = result.intervenant
		if (intervenant === undefined)
			throw new Error('Intervenant not found is HTTP response')
		return {ok: true, intervenant: intervenant}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const intervenantApi = {
	getIntervenantList,
	getIntervenantDetails,
	editIntervenant 
}
export default intervenantApi
