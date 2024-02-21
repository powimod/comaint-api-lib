/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * supplier-api.js
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

const getSupplierList = async function (filters, params) {
	const url = `${apiVersion}/supplier/list`
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
		const supplierList = result.supplierList
		if (supplierList === undefined)
			throw new Error('Supplier list not found is HTTP response')
		return {ok: true, supplierList: supplierList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getSupplierDetails = async function (idSupplier, params) {
	if (isNaN(idSupplier))
		throw new Error('Argument <idSupplier> is not a number')
	const url = `${apiVersion}/supplier/${idSupplier}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const supplier = result.supplier
		if (supplier === undefined)
			throw new Error('Supplier not found is HTTP response')
		return {ok: true, supplier: supplier}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editSupplier = async function (supplier) {
	if (typeof(supplier) !== 'object')
		throw new Error('Argument <supplier> is not an object')
	const url = `${apiVersion}/supplier/edit`
	try {
		const result = await apiTool.request(url, 'POST', { supplier }, null)
		supplier = result.supplier
		if (supplier === undefined)
			throw new Error('Supplier not found is HTTP response')
		return {ok: true, supplier: supplier}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const supplierApi = {
	getSupplierList,
	getSupplierDetails,
	editSupplier 
}
export default supplierApi
