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

/**
 * @module offer-api
 */

'use script'
import ApiToolsSingleton from './api-tools'
const apiTool = ApiToolsSingleton.getInstance()
const apiVersion = 'v1'

/**
 * Returns the Offer list
 * @function
 * @param { Array.<{ filedName:string, fieldValue:string }> } filters - Array of filters with field name and field value.
 * @param { Array } params - not used yet
 * @returns { { ok:boolean, offerList:Array.<Object> } | { ok:boolean, error:string } } - If ok is true, returns an array of Offer objects else returns an error message
 */
const getOfferList = async function (filters, params) {
	const url = `${apiVersion}/offer/list`
	if (! params)
		params = {}
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

/**
 * Returns the Offer details with its properties and values
 * @function
 * @param { integer } idOffer - ID of the searched offer
 * @param { Array } params - not used yet
 * @returns { { ok:boolean, offerList:Object } | { ok:boolean, error:string } } - If ok is true, returns offerList else returns an error message
 */
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

/**
 * Save an Edited Offer object in database.
 * @function
 * @param { Object } offer: the Offer object to save with its valued ID property.
 * @returns { { ok:boolean, offer:Object } | { ok:boolean, error:string } } - if ok is true returns the updated Offer object else returns an error message.
 */
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

/**
 * Save a new Offer object in database.
 * @function
 * @param { Object } offer - the Offer Object to save with its ID value not set or null.
 * @returns { { ok:boolean, offer:Object } } - if ok is true returns the updated offer (with ID valued)
 * @returns { { ok:boolean, error:Object } } - if ok is false returns an error message.
 */
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
