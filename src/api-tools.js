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

/**
 * @module ApiTool
 * Pour utiliser ApiTool, il faut d'abord appeler la fonction 'initialize' en lui passant une configuration
 * qui contient l'URL du backend de l'API et une fonction de rappel qui sera appelée pour le stockage
 * de l'ID de l'account et des jetons d'accès et de rafraîchissement (le front-end Comaint les stocke 
 * dans localStorage).
 */


/**
 * Classe permettant d'exécuter des requêtes HTTP sur le serveur backend (voir méthode 'request')
 * @class
 * @private
 */
class ApiTool {
	#apiBaseUrl = null; 
	#accessToken = null;
	#refreshToken = null;
	#accountId = null;
	//TODO issue-9 #account = null;
	#accountSerializeFunction = null;

	/**
	 * Fonction à appeler pour pouvoir utiliser ce module.
	 *
	 * Si elle est appelée plusieurs fois (ce que fait React en mode développement), seul le premier appel
	 * est pris en compte et les autres sont ignorés sans générer d'erreur.
	 *
	 * Quand la fonction 'initialize' est appelée, la fonction de rappel est aussitôt rappelée avec le mode 'load'
	 * pour charger le contexte initial. Celle-ci doit alors renvoyer l'identifiant du compte et les jetons d'accès
	 * et de renouvellement qui avait été stockés précédemment ou nul s'ils n'ont pas été stockés.
	 *
	 * @param {Object} config : object contenant l'URL du backend API Comaint dans une propriété 'backend.url'.
	 * @param {function} accountSerializeFunction : fonction de rappel pour le stockage de l'ID du compte et des jetons.
	 */
	initialize (config, accountSerializeFunction) {
		if ( this.#apiBaseUrl !== null)
			return; // FIXME do not generate exception since it is called twice with React

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

		if (accountSerializeFunction === undefined)
			throw new Error('[accountSerializeFunction] argument is not defined');
		if (typeof(accountSerializeFunction) !== 'function')
			throw new Error('[accountSerializeFunction] argument is not a function');
		this.#accountSerializeFunction  = accountSerializeFunction;

		const [accountId, refreshToken, accessToken] = this.#accountSerializeFunction('load');

		if (accountId === undefined)
			throw new Error('[accountSerializeFunction] did not return an account ID');
		if (accountId !== null && isNaN(accountId) )
			throw new Error('[accountSerializeFunction] did not return a valid account ID');
		this.#accountId = accountId
		// TODO issue-9 : this.#account = null

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

	_interpretResponse(json)
	{
		let change = false
		console.log("dOm response ", json)

		/* TODO issue-9
		let context = json.data['context']
		if (context !== undefined) {
			console.log("dOm new context detected", context)
			if (context === null) {
				// context is null when logout route is called
				this.#accountId = null
				this.accessToken = null
				this.refreshToken = null
			}
			else {
				this.#accountId = null
			}
			change = true
		}
		*/

		const userId = json.data['userId']
		if (userId !== undefined) {
			console.log("dOm new user ID detected", userId)
			if (userId === null) {
				// context is null when logout route is called
				this.#accountId = null
				this.accessToken = null
				this.refreshToken = null
			}
			else {
				this.#accountId = userId
			}
			change = true
		}

		const accessToken = json.data['access-token']
		if (accessToken !== undefined) {
			console.log("dOm new access token detected", accessToken)
			this.#accessToken = accessToken
			change = true
		}

		const refreshToken = json.data['refresh-token']
		if (refreshToken !== undefined) {
			console.log("dOm new refresh token detected", refreshToken)
			this.#refreshToken = refreshToken
			change = true
		}

		if (change) {
			console.log("dOm call serialize function to save data")
			this.#accountSerializeFunction('save', this.#accountId, this.#refreshToken, this.#accessToken);
		}
	}

	/**
	 * Fonction appelée pour changer l'identifiant de l'account et les jetons d'accès et de rafraîchissement.
	 *
	 * La fonction de sérialisation associée à l'API (voir fonction 'initialize') est alors appelée avec l'argument 
	 * 'mode' défini à 'save'.
	 *
	 * Cette fontion est appelée en interne lorsque la fonction 'request' détecte une erreur de jeton d'accès périmié
	 * lors de l'exécution d'une requête vers la backend.
	 * Elle est aussi appelée par le module 'auth-api' dans les fonctions 'login', 'logout' 'register'.
	 *
	 * @param {Object} account - objet contenant les propriétés du compte comme son ID. Il peut être nul.
	 * 	S'il n'est pas nul, sa propriété 'userId' est récupérée comme identifiant du compte.
	 * @param {string} accessToken - jeton d'accès ou null s'il n'est pas défini.
	 * @param {string} refreshToken - jeton de rafraîchissement ou null s'il n'est pas défini.
	 *
	 */
	/* TODO issue-9
	setAccountAndTokens(accountId, accessToken, refreshToken) {
		if (accountId === undefined || accessToken === undefined || refreshToken === undefined)
			throw new Error('Missing parameters');
		if (typeof(accountId) != 'number')
			throw new Error('Invalid account ID')
		this.#accountId = (account !== null) ? account.userId : null;
		//TODO issue-9 this.#account = account
		this.#accessToken = accessToken;
		this.#refreshToken = refreshToken;
		this.#accountSerializeFunction('save', this.#accountId, this.#refreshToken, this.#accessToken);
	}
	*/

	/**
	 * Fonction appelée en interne pour appeler une route du backend.
	 * La route analyse le résultat reçu qui contient toujours un boolean 'ok' qui indique si la requête a été exécutée avec succès.
	 * Si 'ok' est false alors le message d'erreur est récupéré dans la propriété 'error' et une exception est levée avec ce message
	 * d'erreur.
	 * Si 'ok' est vrai, alors les données sont récupérées avec la propriété 'data' qui est toujours renvoyée par le backend quand
	 * une requête aboutit (si la propriété 'data' n'était pas trouvée alors une exception serait levée)
	 * La fonction renvoie alors l'objet récupéré dans la partie 'data'.
	 * Si le backend renvoie une erreur de jeton d'accès périmé alors la fonction tente de le renouveler en envoyant son jeton
	 * de rafraîchissement avec la route 'auth/refresh'.
	 * La fonction appelle alors 'setAccountAndTokens' deux fois : une première fois pour les réinitialiser avant de tenter 
	 * l'appel de la route 'auth/refresh' puis une seconde fois pour les redéfinir si le rafraîchissement s'est bien produit.
	 * Elle fait ensuite une seconde tentative d'envoi de la requête initiale et renvoie son résultat ou une erreur.
	 * @function
	 * @param {string} route - URL relative de la route à appeler (l'URL complète est construite en la préfixant avec l'URL du backend
	 * 	obtenue à l'initialisation de l'API (voir fonction 'initialize').
	 * @param {string} httpMethod - méthode HTTP (GET, POST, ...)
	 * @param {Object} requestBody - objet passé dans le corps de la requête au format JSON.
	 * @param {params} params -  paramètres HTTP à passer avec la requête (les entêtes Accept et Content-Type seront automatiquement
	 * 	ajoutés et positionnés au format JSON.
	 * @param {boolean} sendAccessToken - non utilisé (le jeton d'accès sera automatiquement transmis s'il est présent dans contexte.
	 * @param {boolean} sendRefreshToken - demande d'envoyer le jeton d'accès (utilisé pour certaines routes comme Logout).
	 * @returns {Object} - resultat de la requête.
	 *
	 */
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

			// issue-9 let currentAccount = this.#account
			let refreshToken = this.#refreshToken
			if (refreshToken === null) 
				throw new Error('No refresh token found to refresh access token')

			// TODO issue-9 
			// reset access and refresh tokens 
			// (important since refresh tokens can be used only one time)
			//console.log("Reset access and refresh tokens in context")
			//this.setAccountAndTokens(currentAccount, null, null)

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

			// TODO issue-9 
			/*
			const accessToken = json.data['access-token']
			if (accessToken === undefined)
				throw new Error(`Can't find new access token`)

			refreshToken = json.data['refresh-token']
			if (refreshToken === undefined)
				throw new Error(`Can't find new refresh token`)

			console.log("Save new access and refresh tokens in context")
			this.setAccountAndTokens(currentAccount, accessToken, refreshToken) 
			*/
			this._interpretResponse(json)

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
		this._interpretResponse(json)
		return json.data;
	}
}

/**
 * Classe singleton permettant d'accéder à l'instance de la classe ApiTool 
 * @class
 * @public
 */
class ApiToolsSingleton {
	static instance = null;

	/**
	 * constructeur interdit car la classe n'est pas instanciable
	 * @constructor
	 * @private
	 */
	constructor() {
		throw new Error('Can not instanciate singleton object!');
	}

	/**
	 * méthode statique permettant l'accès à l'instance de la classe ApiTool
	 * @returns {Object} - instance ApiTool
	 */
	static getInstance() {
		if (! ApiToolsSingleton.instance)
			ApiToolsSingleton.instance = new ApiTool();
		return ApiToolsSingleton.instance;
	}
}

export default ApiToolsSingleton
