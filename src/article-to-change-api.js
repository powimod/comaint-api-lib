/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * article-to-change-api.js
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

const getArticleToChangeList = async function (filters, params) {
	const url = `${apiVersion}/article-to-change/list`
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
		const articleToChangeList = result.articleToChangeList
		if (articleToChangeList === undefined)
			throw new Error('ArticleToChange list not found is HTTP response')
		return {ok: true, articleToChangeList: articleToChangeList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getArticleToChangeDetails = async function (idArticleToChange, params) {
	if (isNaN(idArticleToChange))
		throw new Error('Argument <idArticleToChange> is not a number')
	const url = `${apiVersion}/article-to-change/${idArticleToChange}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const articleToChange = result.articleToChange
		if (articleToChange === undefined)
			throw new Error('ArticleToChange not found is HTTP response')
		return {ok: true, articleToChange: articleToChange}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editArticleToChange = async function (articleToChange) {
	if (typeof(articleToChange) !== 'object')
		throw new Error('Argument <articleToChange> is not an object')
	const url = `${apiVersion}/articleToChange/edit`
	try {
		const result = await apiTool.request(url, 'POST', { articleToChange }, null)
		articleToChange = result.articleToChange
		if (articleToChange === undefined)
			throw new Error('ArticleToChange not found is HTTP response')
		return {ok: true, articleToChange: articleToChange}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const articleToChangeApi = {
	getArticleToChangeList,
	getArticleToChangeDetails,
	editArticleToChange 
}
export default articleToChangeApi
