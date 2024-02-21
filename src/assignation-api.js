/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * assignation-api.js
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

const getAssignationList = async function (filters, params) {
	const url = `${apiVersion}/assignation/list`
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
		const assignationList = result.assignationList
		if (assignationList === undefined)
			throw new Error('Assignation list not found is HTTP response')
		return {ok: true, assignationList: assignationList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getAssignationDetails = async function (idAssignation, params) {
	if (isNaN(idAssignation))
		throw new Error('Argument <idAssignation> is not a number')
	const url = `${apiVersion}/assignation/${idAssignation}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const assignation = result.assignation
		if (assignation === undefined)
			throw new Error('Assignation not found is HTTP response')
		return {ok: true, assignation: assignation}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editAssignation = async function (assignation) {
	if (typeof(assignation) !== 'object')
		throw new Error('Argument <assignation> is not an object')
	const url = `${apiVersion}/assignation/edit`
	try {
		const result = await apiTool.request(url, 'POST', { assignation }, null)
		assignation = result.assignation
		if (assignation === undefined)
			throw new Error('Assignation not found is HTTP response')
		return {ok: true, assignation: assignation}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const assignationApi = {
	getAssignationList,
	getAssignationDetails,
	editAssignation 
}
export default assignationApi
