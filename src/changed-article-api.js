/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * changed-article-api.js
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

const getChangedArticleList = async function (filters, params) {
	const url = `${apiVersion}/changed-article/list`
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
		const changedArticleList = result.changedArticleList
		if (changedArticleList === undefined)
			throw new Error('ChangedArticle list not found is HTTP response')
		return {ok: true, changedArticleList: changedArticleList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getChangedArticleDetails = async function (idChangedArticle, params) {
	if (isNaN(idChangedArticle))
		throw new Error('Argument <idChangedArticle> is not a number')
	const url = `${apiVersion}/changed-article/${idChangedArticle}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const changedArticle = result.changedArticle
		if (changedArticle === undefined)
			throw new Error('ChangedArticle not found is HTTP response')
		return {ok: true, changedArticle: changedArticle}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editChangedArticle = async function (changedArticle) {
	if (typeof(changedArticle) !== 'object')
		throw new Error('Argument <changedArticle> is not an object')
	const url = `${apiVersion}/changedArticle/edit`
	try {
		const result = await apiTool.request(url, 'POST', { changedArticle }, null)
		changedArticle = result.changedArticle
		if (changedArticle === undefined)
			throw new Error('ChangedArticle not found is HTTP response')
		return {ok: true, changedArticle: changedArticle}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const changedArticleApi = {
	getChangedArticleList,
	getChangedArticleDetails,
	editChangedArticle 
}
export default changedArticleApi
