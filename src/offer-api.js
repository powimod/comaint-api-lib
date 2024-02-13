/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * offer-api.js
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use script'
import ApiToolsSingleton from './api-tools'
const apiTool = ApiToolsSingleton.getInstance()
const apiVersion = 'v1'

const getOfferList = async function (filters, params) {
	const url = `${apiVersion}/offer/list`
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
		const offerList = result.offerList
		if (offerList === undefined)
			throw new Error('Offer list not found is HTTP response')
		return {ok: true, offerList: offerList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getOfferDetails = async function (idOffer, params) {
	if (isNaN(idOffer))
		throw new Error('Argument <idOffer> is not a number')
	const url = `${apiVersion}/offer/${idOffer}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const offer = result.offer
		if (offer === undefined)
			throw new Error('Offer not found is HTTP response')
		return {ok: true, offer: offer}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editOffer = async function (offer) {
	if (typeof(offer) !== 'object')
		throw new Error('Argument <offer> is not an object')
	const url = `${apiVersion}/offer/edit`
	try {
		const result = await apiTool.request(url, 'POST', { offer }, null)
		offer = result.offer
		if (offer === undefined)
			throw new Error('Offer not found is HTTP response')
		return {ok: true, offer: offer}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const createOffer = async function (offer) {
	if (typeof(offer) !== 'object')
		throw new Error('Argument <create> is not an object')
	const url = `${apiVersion}/offer/create`
	try {
		const result = await apiTool.request(url, 'POST', { offer }, null)
		offer = result.offer
		if (offer === undefined)
			throw new Error('Offer not found is HTTP response')
		return {ok: true, offer: offer}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const offerApi = {
	getOfferList,
	getOfferDetails,
	editOffer,
	createOffer 
}

export default offerApi
