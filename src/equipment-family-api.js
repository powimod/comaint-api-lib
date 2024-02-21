/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * equipment-family-api.js
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

const getEquipmentFamilyList = async function (filters, params) {
	const url = `${apiVersion}/equipment-family/list`
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
		const equipmentFamilyList = result.equipmentFamilyList
		if (equipmentFamilyList === undefined)
			throw new Error('EquipmentFamily list not found is HTTP response')
		return {ok: true, equipmentFamilyList: equipmentFamilyList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getEquipmentFamilyDetails = async function (idEquipmentFamily, params) {
	if (isNaN(idEquipmentFamily))
		throw new Error('Argument <idEquipmentFamily> is not a number')
	const url = `${apiVersion}/equipment-family/${idEquipmentFamily}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const equipmentFamily = result.equipmentFamily
		if (equipmentFamily === undefined)
			throw new Error('EquipmentFamily not found is HTTP response')
		return {ok: true, equipmentFamily: equipmentFamily}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editEquipmentFamily = async function (equipmentFamily) {
	if (typeof(equipmentFamily) !== 'object')
		throw new Error('Argument <equipmentFamily> is not an object')
	const url = `${apiVersion}/equipmentFamily/edit`
	try {
		const result = await apiTool.request(url, 'POST', { equipmentFamily }, null)
		equipmentFamily = result.equipmentFamily
		if (equipmentFamily === undefined)
			throw new Error('EquipmentFamily not found is HTTP response')
		return {ok: true, equipmentFamily: equipmentFamily}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const equipmentFamilyApi = {
	getEquipmentFamilyList,
	getEquipmentFamilyDetails,
	editEquipmentFamily 
}
export default equipmentFamilyApi
