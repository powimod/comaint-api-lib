/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * intervention-api.js
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

const getInterventionList = async function (filters, params) {
	const url = `${apiVersion}/intervention/list`
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
		const interventionList = result.interventionList
		if (interventionList === undefined)
			throw new Error('Intervention list not found is HTTP response')
		return {ok: true, interventionList: interventionList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getInterventionDetails = async function (idIntervention, params) {
	if (isNaN(idIntervention))
		throw new Error('Argument <idIntervention> is not a number')
	const url = `${apiVersion}/intervention/${idIntervention}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const intervention = result.intervention
		if (intervention === undefined)
			throw new Error('Intervention not found is HTTP response')
		return {ok: true, intervention: intervention}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editIntervention = async function (intervention) {
	if (typeof(intervention) !== 'object')
		throw new Error('Argument <intervention> is not an object')
	const url = `${apiVersion}/intervention/edit`
	try {
		const result = await apiTool.request(url, 'POST', { intervention }, null)
		intervention = result.intervention
		if (intervention === undefined)
			throw new Error('Intervention not found is HTTP response')
		return {ok: true, intervention: intervention}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const interventionApi = {
	getInterventionList,
	getInterventionDetails,
	editIntervention 
}
export default interventionApi
