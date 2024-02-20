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

/**
 * @module auth-api
 */

'use script';
import ApiToolsSingleton from './api-tools';
const apiTools = ApiToolsSingleton.getInstance();
const apiVersion= 'v1';

/**
 * Call the backend API 'auth/login' route to identify user.
 * It calls apiTools.setAccountAndTokens to change account ID and token.
 *
 * @function
 * @param {string} email - User email address.
 * @param {string} password - User password.
 * @returns {ok: boolean, userId: number} - if login is successful, returns an object with ok=true and the account ID 
 * 	(which can be null when no user is connected)
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
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

		const refreshToken = result['refresh-token'];;
		if (refreshToken === undefined)
			throw new Error('refresh-token not found in HTTP response');

		const accessToken = result['access-token'];;
		if (accessToken === undefined)
			throw new Error('access-token not found in HTTP response');

		return { ok: true, userId };
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

/**
 * Call the backend API 'auth/logout' route to terminate user session.
 * Refresh token will be sent in the HTTP request and backends will remove it
 * from its token table in database.
 * It calls apiTools.setAccountAndTokens to set account ID and tokens to null.
 *
 * @function
 * @returns {ok: boolean} - if login is successful, returns an object with ok=true 
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const logout = async function() {
	const url = `${apiVersion}/auth/logout`;
	try {
		const result = await apiTools.request(url, 'POST',  
			null,  // requestBody
			null,  // params
			false, // do not send accessToken
			true); // send refresh token in request body
		return {ok: true};
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		};
	}
}

/**
 * Call the backend API 'auth/register' route for the first step of a new user registration.
 * The account will be created but will be lock until validation code has been sent
 * (see validateRegistration function).
 *
 * It calls apiTools.setAccountAndTokens to set new account ID and tokens.
 *
 * @function
 * @param {string} email - User email address.
 * @param {string} password - User password.
 * @param {string} firstname - User firstname.
 * @param {string} lastname - User lastname.
 *
 * @returns {ok: boolean, userId: number} - if registering is successful, returns an object with ok=true and the new user ID.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const register = async function(email, password, firstname, lastname ) {
	if (email === undefined)
		throw new Error("[email] argument is missing");
	if (password === undefined)
		throw new Error("[password] argument is missing");
	if (firstname === undefined)
		throw new Error("[firstname] argument is missing");
	if (lastname === undefined)
		throw new Error("[lastname] argument is missing");
	const url = `${apiVersion}/auth/register`;
	try {
		// TODO control email and password values are not empty
		const requestBody = {
			email, 
			password,
			firstname,
			lastname,
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


/**
 * Call the 'auth/validateRegistration' to unlock newly created account.
 *
 * @function
 * @param {number} validationCode - validation code witch was sent to the user email address.
 *
 * @returns {ok: boolean} - if validation is successful, returns an object with ok=true.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const validateRegistration = async function(validationCode) {
	if (validationCode === undefined)
		throw new Error("[validationCode] argument is missing");
	const url = `${apiVersion}/auth/validateRegistration`;
	try {
		// TODO control validationCode value is not empty
		const requestBody = { validationCode };
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

/**
 * Call the 'auth/get-context' backend route to get informations about current account.
 *
 * @functioon
 * @returns {ok: boolean, context: Object} - if successful, returns an object with ok=true and the current context.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
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


/**
 * Call the 'auth/locked-account/send-code' to ask backend to send an unlock validation code to user email address.
 * (see unlockAccount)
 *
 * @function
 * @returns {ok: boolean, message: string} - if code was sent successfully, returns an object with ok=true and a message.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const sendUnlockAccountValidationCode = async function() {
	const url = `${apiVersion}/auth/locked-account/send-code`
	try {
		const result = await apiTools.request(url, 'POST', null, null, true)
		return { ok: true, message: result.message}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

/**
 * Call the 'auth/locked-account/validate-code' to unlock an account.
 *
 * @param {number} validationCode : validation code sent to the user address by email (see the 'sendUnlockAccountValidationCode' function)
 * @function
 * @returns {ok: boolean, isValid: boolean} - if successful, returns an object with ok=true and a boolean
 * 	which indicates if validation code was correct or not.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const unlockAccount = async function(validationCode) {
	if (validationCode === undefined)
		throw new Error("[validationCode] argument is missing")
	const url = `${apiVersion}/auth/locked-account/validate-code`
	try {
		const result = await apiTools.request(url, 'POST', { validationCode}, null)
		return { ok: true, isValid: result.isValid }
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

/**
 * Call the 'auth/forgotten-password/send-code' to ask backend to send a code to change password to user email address.
 * (see the 'changePassword' function)
 *
 * @function
 * @param {email} - user email address 
 * @returns {ok: boolean, message: string} - if code was sent successful, returns an object with ok=true and a message.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const sendForgottenPasswordValidationCode = async function(email) {
	if (email === undefined)
		throw new Error("[email] argument is missing")
	const url = `${apiVersion}/auth/forgotten-password/send-code`
	try {
		const result = await apiTools.request(url, 'POST', {email}, null, true)
		return { ok: true, message: result.message}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}

/**
 * Call the 'auth/forgotten-password/change-password' to change user passwor.
 *
 * @param {string} email - user email address.
 * @param {string} newPassword - new password to set.
 * @param {number} validationCode : validation code sent to the user address by email (see the 'sendForgottenPasswordValidationCode' function)
 * @function
 * @returns {ok: boolean, changed: boolean} - if successful, returns an object with ok=true and a boolean
 * 	which indicates if password was changed or not.
 * @returns {ok: boolean, error: string} - Otherwise returns an object with ok=false and an error message.
 */
const changePassword = async function(email, newPassword, validationCode) {
	if (email === undefined)
		throw new Error("[email] argument is missing")
	if (newPassword === undefined)
		throw new Error("[newPassword] argument is missing")
	if (validationCode === undefined)
		throw new Error("[validationCode] argument is missing")
	const url = `${apiVersion}/auth/forgotten-password/change-password`
	try {
		const result = await apiTools.request(url, 'POST', { email, newPassword, validationCode}, null)
		return { ok: true, changed: result.changed}
	}
	catch (error) {
		return {
			ok: false, 
			error: (error.message !== undefined) ? error.message : error
		}
	}
}


const authApi = {
	login,
	logout,
	register,
	validateRegistration,
	getContext,
	sendUnlockAccountValidationCode,
	unlockAccount,
	sendForgottenPasswordValidationCode,
	changePassword 
}
export default authApi;
