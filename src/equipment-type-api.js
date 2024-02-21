/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * equipment-type-api.js
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

const getEquipmentTypeList = async function (filters, params) {
	const url = `${apiVersion}/equipment-type/list`
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
		const equipmentTypeList = result.equipmentTypeList
		if (equipmentTypeList === undefined)
			throw new Error('EquipmentType list not found is HTTP response')
		return {ok: true, equipmentTypeList: equipmentTypeList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getEquipmentTypeDetails = async function (idEquipmentType, params) {
	if (isNaN(idEquipmentType))
		throw new Error('Argument <idEquipmentType> is not a number')
	const url = `${apiVersion}/equipment-type/${idEquipmentType}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const equipmentType = result.equipmentType
		if (equipmentType === undefined)
			throw new Error('EquipmentType not found is HTTP response')
		return {ok: true, equipmentType: equipmentType}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editEquipmentType = async function (equipmentType) {
	if (typeof(equipmentType) !== 'object')
		throw new Error('Argument <equipmentType> is not an object')
	const url = `${apiVersion}/equipmentType/edit`
	try {
		const result = await apiTool.request(url, 'POST', { equipmentType }, null)
		equipmentType = result.equipmentType
		if (equipmentType === undefined)
			throw new Error('EquipmentType not found is HTTP response')
		return {ok: true, equipmentType: equipmentType}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const equipmentTypeApi = {
	getEquipmentTypeList,
	getEquipmentTypeDetails,
	editEquipmentType 
}
export default equipmentTypeApi
