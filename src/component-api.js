/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * component-api.js
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

const getComponentList = async function (filters, params) {
	const url = `${apiVersion}/component/list`
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
		const componentList = result.componentList
		if (componentList === undefined)
			throw new Error('Component list not found is HTTP response')
		return {ok: true, componentList: componentList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getComponentDetails = async function (idComponent, params) {
	if (isNaN(idComponent))
		throw new Error('Argument <idComponent> is not a number')
	const url = `${apiVersion}/component/${idComponent}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const component = result.component
		if (component === undefined)
			throw new Error('Component not found is HTTP response')
		return {ok: true, component: component}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editComponent = async function (component) {
	if (typeof(component) !== 'object')
		throw new Error('Argument <component> is not an object')
	const url = `${apiVersion}/component/edit`
	try {
		const result = await apiTool.request(url, 'POST', { component }, null)
		component = result.component
		if (component === undefined)
			throw new Error('Component not found is HTTP response')
		return {ok: true, component: component}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const componentApi = {
	getComponentList,
	getComponentDetails,
	editComponent 
}
export default componentApi
