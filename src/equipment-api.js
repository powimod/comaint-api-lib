/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * equipment-api.js
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

const getEquipmentList = async function (filters, params) {
	const url = `${apiVersion}/equipment/list`
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
		const equipmentList = result.equipmentList
		if (equipmentList === undefined)
			throw new Error('Equipment list not found is HTTP response')
		return {ok: true, equipmentList: equipmentList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getEquipmentDetails = async function (idEquipment, params) {
	if (isNaN(idEquipment))
		throw new Error('Argument <idEquipment> is not a number')
	const url = `${apiVersion}/equipment/${idEquipment}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const equipment = result.equipment
		if (equipment === undefined)
			throw new Error('Equipment not found is HTTP response')
		return {ok: true, equipment: equipment}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editEquipment = async function (equipment) {
	if (typeof(equipment) !== 'object')
		throw new Error('Argument <equipment> is not an object')
	const url = `${apiVersion}/equipment/edit`
	try {
		const result = await apiTool.request(url, 'POST', { equipment }, null)
		equipment = result.equipment
		if (equipment === undefined)
			throw new Error('Equipment not found is HTTP response')
		return {ok: true, equipment: equipment}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const equipmentApi = {
	getEquipmentList,
	getEquipmentDetails,
	editEquipment 
}
export default equipmentApi
