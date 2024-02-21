/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * section-api.js
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

const getSectionList = async function (filters, params) {
	const url = `${apiVersion}/section/list`
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
		const sectionList = result.sectionList
		if (sectionList === undefined)
			throw new Error('Section list not found is HTTP response')
		return {ok: true, sectionList: sectionList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getSectionDetails = async function (idSection, params) {
	if (isNaN(idSection))
		throw new Error('Argument <idSection> is not a number')
	const url = `${apiVersion}/section/${idSection}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const section = result.section
		if (section === undefined)
			throw new Error('Section not found is HTTP response')
		return {ok: true, section: section}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editSection = async function (section) {
	if (typeof(section) !== 'object')
		throw new Error('Argument <section> is not an object')
	const url = `${apiVersion}/section/edit`
	try {
		const result = await apiTool.request(url, 'POST', { section }, null)
		section = result.section
		if (section === undefined)
			throw new Error('Section not found is HTTP response')
		return {ok: true, section: section}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const sectionApi = {
	getSectionList,
	getSectionDetails,
	editSection 
}
export default sectionApi
