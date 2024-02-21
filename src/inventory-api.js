/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * inventory-api.js
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

const getInventoryList = async function (filters, params) {
	const url = `${apiVersion}/inventory/list`
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
		const inventoryList = result.inventoryList
		if (inventoryList === undefined)
			throw new Error('Inventory list not found is HTTP response')
		return {ok: true, inventoryList: inventoryList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getInventoryDetails = async function (idInventory, params) {
	if (isNaN(idInventory))
		throw new Error('Argument <idInventory> is not a number')
	const url = `${apiVersion}/inventory/${idInventory}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const inventory = result.inventory
		if (inventory === undefined)
			throw new Error('Inventory not found is HTTP response')
		return {ok: true, inventory: inventory}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editInventory = async function (inventory) {
	if (typeof(inventory) !== 'object')
		throw new Error('Argument <inventory> is not an object')
	const url = `${apiVersion}/inventory/edit`
	try {
		const result = await apiTool.request(url, 'POST', { inventory }, null)
		inventory = result.inventory
		if (inventory === undefined)
			throw new Error('Inventory not found is HTTP response')
		return {ok: true, inventory: inventory}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const inventoryApi = {
	getInventoryList,
	getInventoryDetails,
	editInventory 
}
export default inventoryApi
