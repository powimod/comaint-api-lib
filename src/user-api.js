/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * user-api.js
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

const getUserList = async function (filters, params) {
	const url = `${apiVersion}/user/list`
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
		const userList = result.userList
		if (userList === undefined)
			throw new Error('User list not found is HTTP response')
		return {ok: true, userList: userList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getUserDetails = async function (idUser, params) {
	if (isNaN(idUser))
		throw new Error('Argument <idUser> is not a number')
	const url = `${apiVersion}/user/${idUser}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const user = result.user
		if (user === undefined)
			throw new Error('User not found is HTTP response')
		return {ok: true, user: user}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editUser = async function (user) {
	if (typeof(user) !== 'object')
		throw new Error('Argument <user> is not an object')
	const url = `${apiVersion}/user/edit`
	try {
		const result = await apiTool.request(url, 'POST', { user }, null)
		user = result.user
		if (user === undefined)
			throw new Error('User not found is HTTP response')
		return {ok: true, user: user}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const userApi = {
	getUserList,
	getUserDetails,
	editUser 
}
export default userApi
