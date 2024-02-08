/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * api-tools.js
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

class ApiTool {
	#apiBaseUrl = null; 
	#accessToken = null;
	#refreshToken = null;
	#accountId = null;
	#account = null;
	#accountSerializeFunction = null;

	_load() {
		const [accountId, refreshToken, accessToken] = this.#accountSerializeFunction('load');

		if (accountId === undefined)
			throw new Error('[accountSerializeFunction] did not return an account ID');
		if (accountId !== null && isNaN(accountId) )
			throw new Error('[accountSerializeFunction] did not return a valid account ID');
		this.#accountId = accountId
		this.#account = null

		if (refreshToken === undefined)
			throw new Error('[accountSerializeFunction] did not return a refresh token');
		if (refreshToken !== null && typeof(refreshToken) !== 'string')
			throw new Error('[accountSerializeFunction] did not return a valid refresh token');
		this.#refreshToken = refreshToken;

		if (accessToken === undefined)
			throw new Error('[accountSerializeFunction] did not return a access token');
		if (accessToken !== null && typeof(accessToken) !== 'string')
			throw new Error('[accountSerializeFunction] did not return a valid access token');
		this.#accessToken = accessToken;
	}

	initialize (config, accountSerializeFunction) {
		if ( this.#apiBaseUrl !== null)
			return; // FIXME do not generate exception since it is called twice with React

		if (accountSerializeFunction === undefined)
			throw new Error('[accountSerializeFunction] argument is not defined');
		if (typeof(accountSerializeFunction) !== 'function')
			throw new Error('[accountSerializeFunction] argument is not a function');
		this.#accountSerializeFunction  = accountSerializeFunction;
		this._load();

		if (config === undefined)
			throw new Error('[config] argument is missing');
		if (config.backend === undefined)
			throw new Error('Section [backend] is not defined in config"');
		if (config.backend.url === undefined)
			throw new Error('Parameter [url] is not defined [backend] section');
		this.#apiBaseUrl = config.backend.url
		console.log('API backend url', this.#apiBaseUrl )
		if (config.backend.url === undefined)
			throw new Error('Parameter [url] is not defined [backend] section');
	}

	setAccountAndTokens(account, accessToken, refreshToken) {
		if (account === undefined || accessToken === undefined || refreshToken === undefined)
			throw new Error('Missing parameters');
		
		this.#accountId = (account !== null) ? account.userId : null;
		this.#account = account
		this.#accessToken = accessToken;
		this.#refreshToken = refreshToken;
		this.#accountSerializeFunction('save', this.#accountId, this.#refreshToken, this.#accessToken);
	}

	async request(route, httpMethod, requestBody = null, params = null, sendAccessToken = true, sendRefreshToken = false){
		if ( this.#apiBaseUrl === null)
			throw new Error('Apitools is not initialized');
		const apiUrl = new URL(`${this.#apiBaseUrl}/${route}`);
		console.log(`API call ${apiUrl}`);
		if (params !== null) {
			if (params.filters !== undefined) {
				for (const filter of Object.keys(params.filters)) 
					apiUrl.searchParams.append(filter, params.filters[filter]);
			}
			if (params.resultsPerPage !== undefined)
				apiUrl.searchParams.append('resultsPerPage', params.resultsPerPage);
		}
		const httpHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
		// TODO remove 'sendAccessToken' parameter
		// if (sendAccessToken && this.#accessToken !== null)
		if (this.#accessToken !== null)
			httpHeaders['x-access-token'] = this.#accessToken;

		if (sendRefreshToken) {
			if (this.#refreshToken === null) {
				console.error("Refresh token not found");
				return; // success
			}
			if (requestBody === null)
				requestBody = {}
			requestBody.refreshToken = this.#refreshToken
		}

		const requestParams = {
			method : httpMethod,
			headers: httpHeaders
		}
		if (requestBody !== null)
			requestParams.body = JSON.stringify(requestBody);

		// first attempt
		let result = await fetch(apiUrl, requestParams);
		if (result.status !== 200) 
			throw new Error(`HTTP response status is ${result.status} (${result.statusText})`);
		let json = await result.json();
		if (json === null)
			throw new Error('JSON response is null');
		if (json.ok === undefined)
			throw new Error('OK status not found in JSON response');
		if (typeof(json.ok) !== 'boolean')
			throw new Error('OK status is not a boolean in JSON response');

		if (json.ok === false && json.error === 'Expired token' ) {
			console.log('Refreshing access token...')

			let currentAccount = this.#account
			let refreshToken = this.#refreshToken
			if (refreshToken === null) 
				throw new Error('No refresh token found to refresh access token')

			// reset access and refresh tokens 
			// (important since refresh tokens can be used only one time)
			console.log("Reset access and refresh tokens in context")
			this.setAccountAndTokens(currentAccount, null, null)

			const refreshApiUrl = new URL(`${this.#apiBaseUrl}/v1/auth/refresh`)
			const refreshHttpHeaders = {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
			const refreshRequestBody = {
				token: refreshToken
			}
			const refreshParams = {
				method: 'POST',
				headers: refreshHttpHeaders,
				body: JSON.stringify(refreshRequestBody)
			}
			result = await fetch(refreshApiUrl, refreshParams);
			if (result.status !== 200) 
				throw new Error(`HTTP response status is ${result.status} (${result.statusText})`)
			json = await result.json()
			if (json === null)
				throw new Error('JSON response is null')
			if (json.ok === undefined)
				throw new Error('OK status not found in JSON response')
			if (typeof(json.ok) !== 'boolean')
				throw new Error('OK status is not a boolean in JSON response')

			if (! json.ok) {
				console.log(`Error while refreshing tokens : ${json.error}`)
				throw new Error(`Error while refreshing tokens : ${json.error}`)
			}

			const accessToken = json.data['access-token']
			if (accessToken === undefined)
				throw new Error(`Can't find new access token`)

			refreshToken = json.data['refresh-token']
			if (refreshToken === undefined)
				throw new Error(`Can't find new refresh token`)

			console.log("Save new access and refresh tokens in context")
			this.setAccountAndTokens(currentAccount, accessToken, refreshToken) 

			console.log(`Retry calling API ${apiUrl}`);

			// second attempt
			httpHeaders['x-access-token'] = json.data['access-token']
			result = await fetch(apiUrl, requestParams)
			if (result.status !== 200) 
				throw new Error(`HTTP response status is ${result.status} (${result.statusText})`);
			json = await result.json()
			if (json === null)
				throw new Error('JSON response is null')
			if (json.ok === undefined)
				throw new Error('OK status not found in JSON response')
			if (typeof(json.ok) !== 'boolean')
				throw new Error('OK status is not a boolean in JSON response')
		}

		if (! json.ok )
			throw new Error(json.error);
		if (json.data === undefined)
			throw new Error('data not found in JSON response');
		return json.data;
	}
}

class ApiToolsSingleton {
	static instance = null;

	constructor() {
		throw new Error('Can not instanciate singleton object!');
	}

	static getInstance() {
		if (! ApiToolsSingleton.instance)
			ApiToolsSingleton.instance = new ApiTool();
		return ApiToolsSingleton.instance;
	}
}

export default ApiToolsSingleton
