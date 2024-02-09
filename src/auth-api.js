/* Comaint API libary project (Javascript libary to easily access Comain API)
 * Copyright (C) 2023-2024 Dominique Parisot
 *
 * auth-api.js
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


'use script';
import ApiToolsSingleton from './api-tools';
const apiTools = ApiToolsSingleton.getInstance();
const apiVersion= 'v1';

const login = async function(email, password) {
	if (email === undefined)
		throw new Error("[email] argument is missing");
	if (password === undefined)
		throw new Error("[password] argument is missing");
	const url = `${apiVersion}/auth/login`;

	try {
		// TODO control email and password values

		const requestBody = {
			email: email, 
			password: password
		};
		const result = await apiTools.request(url, 'POST',  requestBody, null, false);

		const userId = result['userId'];;
		if (userId === undefined)
			throw new Error('userId not found in HTTP response');

		const firstname = result['firstname'];;
		if (firstname === undefined)
			throw new Error('firstname not found in HTTP response');
		
		const lastname = result['lastname'];;
		if (lastname === undefined)
			throw new Error('lastname not found in HTTP response');
		
/* TODO cleanup		
		const administrator = result['administrator'];;
		if (administrator === undefined)
			throw new Error('administrator not found in HTTP response');
		
		const parkRole = result['parkRole'];;
		if (parkRole === undefined)
			throw new Error('parkRole not found in HTTP response');
		
		const stockRole = result['stockRole'];;
		if (stockRole === undefined)
			throw new Error('stockRole not found in HTTP response');
		
		const active = result['active'];;
		if (active === undefined)
			throw new Error('active not found in HTTP response');
		
		const accountLocked = result['accountLocked'];;
		if (accountLocked === undefined)
			throw new Error('accountLocked not found in HTTP response');
			*/
		

		const refreshToken = result['refresh-token'];;
		if (refreshToken === undefined)
			throw new Error('refresh-token not found in HTTP response');

		const accessToken = result['access-token'];;
		if (accessToken === undefined)
			throw new Error('access-token not found in HTTP response');

		const account = { userId, email,firstname,lastname,administrator,parkRole,stockRole,active,accountLocked,}
		apiTools.setAccountAndTokens(account, accessToken, refreshToken)

		return { ok: true, ...account };
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

const logout = async function() {
	const url = `${apiVersion}/auth/logout`;
	try {
		const result = await apiTools.request(url, 'POST',  
			null,  // requestBody
			null,  // params
			false, // do not send accessToken
			true); // send refresh token in request body
		apiTools.setAccountAndTokens(null, null, null)
		return {ok: true};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

// TODO cleanup
//const register = async function(email, password, firstname, lastname, administrator, parkRole, stockRole, active, accountLocked) {
const register = async function(email, password, firstname, lastname ) {
	if (email === undefined)
		throw new Error("[email] argument is missing");
	if (password === undefined)
		throw new Error("[password] argument is missing");
	if (firstname === undefined)
		throw new Error("[firstname] argument is missing");
	if (lastname === undefined)
		throw new Error("[lastname] argument is missing");
	/* TODO cleanup
	if (administrator === undefined)
		throw new Error("[administrator] argument is missing");
	if (parkRole === undefined)
		throw new Error("[parkRole] argument is missing");
	if (stockRole === undefined)
		throw new Error("[stockRole] argument is missing");
	if (active === undefined)
		throw new Error("[active] argument is missing");
	if (accountLocked === undefined)
		throw new Error("[accountLocked] argument is missing");
		*/
	const url = `${apiVersion}/auth/register`;
	try {
		// TODO control email and password values are not empty
		const requestBody = {
			email, 
			password,
			firstname,
			lastname,
			/* TODO cleanup
			administrator,
			parkRole,
			stockRole,
			active,
			accountLocked,
			*/
			}
		const result = await apiTools.request(url, 'POST',  requestBody, null, false);
		const userId = result['userId'];;
		if (userId === undefined)
			throw new Error('userId not found in HTTP response');
		const refreshToken = result['refresh-token'];;
		if (refreshToken === undefined)
			throw new Error('refresh-token not found in HTTP response');
		const accessToken = result['access-token'];;
		if (accessToken === undefined)
			throw new Error('access-token not found in HTTP response');
		const account = { userId, email,firstname,lastname,administrator,parkRole,stockRole,active,accountLocked,}
		apiTools.setAccountAndTokens(account, accessToken, refreshToken)

		return {
			ok: true, 
			userId: userId
		};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

const validateRegistration = async function(validationCode) {
	if (validationCode === undefined)
		throw new Error("[validationCode] argument is missing");
	const url = `${apiVersion}/auth/validateRegistration`;
	try {
		// TODO control validationCode value is not empty
		const requestBody = {
			validationCode: validationCode
		};
		const result = await apiTools.request(url, 'POST',  requestBody, null, true);
		return {ok: true};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

const getContext = async function() {
	const url = `${apiVersion}/auth/get-context`;
	try {
		const result = await apiTools.request(url, 'GET', null, null, false);
		if (result.context === undefined)
			throw new Error(`Can't find context in API response`);
		return { ok: true, context: result.context };
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}


const authApi = {
	login: login,
	logout: logout,
	register: register,
	validateRegistration : validateRegistration,
	getContext: getContext
}
export default authApi;
