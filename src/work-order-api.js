/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * work-order-api.js
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

const getWorkOrderList = async function (filters, params) {
	const url = `${apiVersion}/work-order/list`
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
		const workOrderList = result.workOrderList
		if (workOrderList === undefined)
			throw new Error('WorkOrder list not found is HTTP response')
		return {ok: true, workOrderList: workOrderList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getWorkOrderDetails = async function (idWorkOrder, params) {
	if (isNaN(idWorkOrder))
		throw new Error('Argument <idWorkOrder> is not a number')
	const url = `${apiVersion}/work-order/${idWorkOrder}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const workOrder = result.workOrder
		if (workOrder === undefined)
			throw new Error('WorkOrder not found is HTTP response')
		return {ok: true, workOrder: workOrder}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editWorkOrder = async function (workOrder) {
	if (typeof(workOrder) !== 'object')
		throw new Error('Argument <workOrder> is not an object')
	const url = `${apiVersion}/workOrder/edit`
	try {
		const result = await apiTool.request(url, 'POST', { workOrder }, null)
		workOrder = result.workOrder
		if (workOrder === undefined)
			throw new Error('WorkOrder not found is HTTP response')
		return {ok: true, workOrder: workOrder}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const workOrderApi = {
	getWorkOrderList,
	getWorkOrderDetails,
	editWorkOrder 
}
export default workOrderApi
