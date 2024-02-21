/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * article-category-api.js
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

const getArticleCategoryList = async function (filters, params) {
	const url = `${apiVersion}/article-category/list`
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
		const articleCategoryList = result.articleCategoryList
		if (articleCategoryList === undefined)
			throw new Error('ArticleCategory list not found is HTTP response')
		return {ok: true, articleCategoryList: articleCategoryList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getArticleCategoryDetails = async function (idArticleCategory, params) {
	if (isNaN(idArticleCategory))
		throw new Error('Argument <idArticleCategory> is not a number')
	const url = `${apiVersion}/article-category/${idArticleCategory}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const articleCategory = result.articleCategory
		if (articleCategory === undefined)
			throw new Error('ArticleCategory not found is HTTP response')
		return {ok: true, articleCategory: articleCategory}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editArticleCategory = async function (articleCategory) {
	if (typeof(articleCategory) !== 'object')
		throw new Error('Argument <articleCategory> is not an object')
	const url = `${apiVersion}/articleCategory/edit`
	try {
		const result = await apiTool.request(url, 'POST', { articleCategory }, null)
		articleCategory = result.articleCategory
		if (articleCategory === undefined)
			throw new Error('ArticleCategory not found is HTTP response')
		return {ok: true, articleCategory: articleCategory}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const articleCategoryApi = {
	getArticleCategoryList,
	getArticleCategoryDetails,
	editArticleCategory 
}
export default articleCategoryApi
