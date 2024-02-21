/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * order-line-api.js
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

const getOrderLineList = async function (filters, params) {
	const url = `${apiVersion}/order-line/list`
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
		const orderLineList = result.orderLineList
		if (orderLineList === undefined)
			throw new Error('OrderLine list not found is HTTP response')
		return {ok: true, orderLineList: orderLineList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getOrderLineDetails = async function (idOrderLine, params) {
	if (isNaN(idOrderLine))
		throw new Error('Argument <idOrderLine> is not a number')
	const url = `${apiVersion}/order-line/${idOrderLine}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const orderLine = result.orderLine
		if (orderLine === undefined)
			throw new Error('OrderLine not found is HTTP response')
		return {ok: true, orderLine: orderLine}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editOrderLine = async function (orderLine) {
	if (typeof(orderLine) !== 'object')
		throw new Error('Argument <orderLine> is not an object')
	const url = `${apiVersion}/orderLine/edit`
	try {
		const result = await apiTool.request(url, 'POST', { orderLine }, null)
		orderLine = result.orderLine
		if (orderLine === undefined)
			throw new Error('OrderLine not found is HTTP response')
		return {ok: true, orderLine: orderLine}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const orderLineApi = {
	getOrderLineList,
	getOrderLineDetails,
	editOrderLine 
}
export default orderLineApi
