/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * order-api.js
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

const getOrderList = async function (filters, params) {
	const url = `${apiVersion}/order/list`
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
		const orderList = result.orderList
		if (orderList === undefined)
			throw new Error('Order list not found is HTTP response')
		return {ok: true, orderList: orderList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getOrderDetails = async function (idOrder, params) {
	if (isNaN(idOrder))
		throw new Error('Argument <idOrder> is not a number')
	const url = `${apiVersion}/order/${idOrder}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const order = result.order
		if (order === undefined)
			throw new Error('Order not found is HTTP response')
		return {ok: true, order: order}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editOrder = async function (order) {
	if (typeof(order) !== 'object')
		throw new Error('Argument <order> is not an object')
	const url = `${apiVersion}/order/edit`
	try {
		const result = await apiTool.request(url, 'POST', { order }, null)
		order = result.order
		if (order === undefined)
			throw new Error('Order not found is HTTP response')
		return {ok: true, order: order}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const orderApi = {
	getOrderList,
	getOrderDetails,
	editOrder 
}
export default orderApi
