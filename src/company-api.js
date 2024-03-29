/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * company-api.js
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

const getCompanyList = async function (filters, params) {
	const url = `${apiVersion}/company/list`
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
		const companyList = result.companyList
		if (companyList === undefined)
			throw new Error('Company list not found is HTTP response')
		return {ok: true, companyList: companyList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getCompanyDetails = async function (idCompany, params) {
	if (isNaN(idCompany))
		throw new Error('Argument <idCompany> is not a number')
	const url = `${apiVersion}/company/${idCompany}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const company = result.company
		if (company === undefined)
			throw new Error('Company not found is HTTP response')
		return {ok: true, company: company}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editCompany = async function (company) {
	if (typeof(company) !== 'object')
		throw new Error('Argument <company> is not an object')
	const url = `${apiVersion}/company/edit`
	try {
		const result = await apiTool.request(url, 'POST', { company }, null)
		company = result.company
		if (company === undefined)
			throw new Error('Company not found is HTTP response')
		return {ok: true, company: company}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const companyApi = {
	getCompanyList,
	getCompanyDetails,
	editCompany 
}
export default companyApi
