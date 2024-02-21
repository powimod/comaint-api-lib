/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * article-sub-category-api.js
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

const getArticleSubCategoryList = async function (filters, params) {
	const url = `${apiVersion}/article-sub-category/list`
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
		const articleSubCategoryList = result.articleSubCategoryList
		if (articleSubCategoryList === undefined)
			throw new Error('ArticleSubCategory list not found is HTTP response')
		return {ok: true, articleSubCategoryList: articleSubCategoryList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getArticleSubCategoryDetails = async function (idArticleSubCategory, params) {
	if (isNaN(idArticleSubCategory))
		throw new Error('Argument <idArticleSubCategory> is not a number')
	const url = `${apiVersion}/article-sub-category/${idArticleSubCategory}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const articleSubCategory = result.articleSubCategory
		if (articleSubCategory === undefined)
			throw new Error('ArticleSubCategory not found is HTTP response')
		return {ok: true, articleSubCategory: articleSubCategory}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editArticleSubCategory = async function (articleSubCategory) {
	if (typeof(articleSubCategory) !== 'object')
		throw new Error('Argument <articleSubCategory> is not an object')
	const url = `${apiVersion}/articleSubCategory/edit`
	try {
		const result = await apiTool.request(url, 'POST', { articleSubCategory }, null)
		articleSubCategory = result.articleSubCategory
		if (articleSubCategory === undefined)
			throw new Error('ArticleSubCategory not found is HTTP response')
		return {ok: true, articleSubCategory: articleSubCategory}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const articleSubCategoryApi = {
	getArticleSubCategoryList,
	getArticleSubCategoryDetails,
	editArticleSubCategory 
}
export default articleSubCategoryApi
