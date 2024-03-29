/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * subscription-api.js
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

const getSubscriptionList = async function (filters, params) {
	const url = `${apiVersion}/subscription/list`
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
		const subscriptionList = result.subscriptionList
		if (subscriptionList === undefined)
			throw new Error('Subscription list not found is HTTP response')
		return {ok: true, subscriptionList: subscriptionList}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const getSubscriptionDetails = async function (idSubscription, params) {
	if (isNaN(idSubscription))
		throw new Error('Argument <idSubscription> is not a number')
	const url = `${apiVersion}/subscription/${idSubscription}`
	try {
		const result = await apiTool.request(url, 'GET', null, null)
		const subscription = result.subscription
		if (subscription === undefined)
			throw new Error('Subscription not found is HTTP response')
		return {ok: true, subscription: subscription}
	}
	catch (error) {
		return {
			ok: false,
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const editSubscription = async function (subscription) {
	if (typeof(subscription) !== 'object')
		throw new Error('Argument <subscription> is not an object')
	const url = `${apiVersion}/subscription/edit`
	try {
		const result = await apiTool.request(url, 'POST', { subscription }, null)
		subscription = result.subscription
		if (subscription === undefined)
			throw new Error('Subscription not found is HTTP response')
		return {ok: true, subscription: subscription}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

const subscriptionApi = {
	getSubscriptionList,
	getSubscriptionDetails,
	editSubscription 
}
export default subscriptionApi
