/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * catalog-api.js
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

const getCatalogList = async function (filters, params) {
	const url = `${apiVersion}/catalog/list`
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
		const catalogList = result.catalogList
		if (catalogList === undefined)
			throw new Error('Catalog list not found is HTTP response')
		return {ok: true, catalogList: catalogList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getCatalogDetails = async function (idCatalog, params) {
	if (isNaN(idCatalog))
		throw new Error('Argument <idCatalog> is not a number')
	const url = `${apiVersion}/catalog/${idCatalog}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const catalog = result.catalog
		if (catalog === undefined)
			throw new Error('Catalog not found is HTTP response')
		return {ok: true, catalog: catalog}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editCatalog = async function (catalog) {
	if (typeof(catalog) !== 'object')
		throw new Error('Argument <catalog> is not an object')
	const url = `${apiVersion}/catalog/edit`
	try {
		const result = await apiTool.request(url, 'POST', { catalog }, null)
		catalog = result.catalog
		if (catalog === undefined)
			throw new Error('Catalog not found is HTTP response')
		return {ok: true, catalog: catalog}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const catalogApi = {
	getCatalogList,
	getCatalogDetails,
	editCatalog 
}
export default catalogApi
