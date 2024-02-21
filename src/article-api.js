/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * article-api.js
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

const getArticleList = async function (filters, params) {
	const url = `${apiVersion}/article/list`
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
		const articleList = result.articleList
		if (articleList === undefined)
			throw new Error('Article list not found is HTTP response')
		return {ok: true, articleList: articleList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getArticleDetails = async function (idArticle, params) {
	if (isNaN(idArticle))
		throw new Error('Argument <idArticle> is not a number')
	const url = `${apiVersion}/article/${idArticle}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const article = result.article
		if (article === undefined)
			throw new Error('Article not found is HTTP response')
		return {ok: true, article: article}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editArticle = async function (article) {
	if (typeof(article) !== 'object')
		throw new Error('Argument <article> is not an object')
	const url = `${apiVersion}/article/edit`
	try {
		const result = await apiTool.request(url, 'POST', { article }, null)
		article = result.article
		if (article === undefined)
			throw new Error('Article not found is HTTP response')
		return {ok: true, article: article}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const articleApi = {
	getArticleList,
	getArticleDetails,
	editArticle 
}
export default articleApi
