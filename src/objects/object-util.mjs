'use strict'

function rawError(error, infos = null) {
        return `${error} : ${JSON.stringify(infos)}`
}

const controlObject = (objDef, object, i18n_t = null) => {
	if (i18n_t === null) i18n_t = rawError
	if (objDef === undefined)
		throw new Error('objDef argument is missing')
	if (typeof(objDef) != 'object')
		throw new Error('objDef argument is not an object')
	if (object === undefined)
		throw new Error('object argument is missing')
	if (typeof(object) != 'object')
		throw new Error('object argument is not an object')

	for (const [propName, propDef] of Object.entries(objDef)) {
		const error = controlObjectProperty (objDef, propName, propValue, i18n_t)
		if (error)
			return error
	}
	return false // no error
}

const controlObjectProperty = (objDef, propName, propValue, i18n_t = null) => {
	if (i18n_t === null) i18n_t = rawError
	if (objDef === undefined)
		throw new Error('objDef argument is missing')
	if (typeof(objDef) != 'object')
		throw new Error('objDef argument is not an object')
	if (propName === undefined)
		throw new Error('propName argument is missing')
	if (typeof(propName) != 'string')
		throw new Error('propName argument is not a string')
	const propDef = objDef[propName]
	if (propDef === undefined)
		throw new Error(`Invalid property name [${propName}]`)

	if (propValue === undefined)
		return i18n_t('error.prop.is_not_defined', {property: propName})

	if (propValue === null) {
		if (prop.mandatory)
			return i18n_t('error.prop.is_null', {property: propName})
		else
			return null
	}

	if (propDef.secret) {
		// FIXME secret property is only supported for string properties
		// (replace "secret" property by a "password" property type
		if (typeof(propValue) !== 'string' )
			return i18n_t('error.prop.is_not_a_string', {property: propName})
		if (propDef.minimum && propValue.length < propDef.minimum )
			return i18n_t('error.prop.password_to_small', {property: propName, size: propDef.minimum})
		let nLower = 0
		let nUpper = 0
		let nDigit = 0
		let nSpec = 0
		for (const c of propValue) {
			if (c >= 'a' && c <= 'z') nLower++
			else if (c >= 'A' && c <= 'Z') nUpper++
			else if (c >= '0' && c <= '9') nDigit++
			else nSpec++ 
		}
		if (nLower == 0)
			return i18n_t('error.prop.password_no_lowercase_letter', {property: propName})
		if (nUpper == 0)
			return i18n_t('error.prop.password_no_uppercase_letter', {property: propName})
		if (nDigit == 0)
			return i18n_t('error.prop.password_no_digit_character', {property: propName})
		if (nSpec == 0)
			return i18n_t('error.prop.password_no_special_character', {property: propName})
		return false // no error
	}
	
	switch (propDef.type) {
		case 'id':
		case 'integer':
			if (typeof(propValue) !== 'number' )
				return i18n_t('error.prop.is_not_a_integer', {property: propName})
			//if (isNaN(propValue))
			//	return i18n_t('error.prop.is_not_an_integer', {property: propName})
			if (propDef.minimum && propValue < propDef.minimum )
				return i18n_t('error.prop.is_too_small', {property: propName, size: propDef.minimum})
			if (propDef.maximum && propValue > propDef.maximum )
				return i18n_t('error.prop.is_too_large', {property: propName, size: propDef.maximum})
			return false // no error
		case 'string':
		case 'text':
			if (typeof(propValue) !== 'string' )
				return i18n_t('error.prop.is_not_a_string', {property: propName})
			if (propDef.minimum && propValue.length < propDef.minimum )
				return i18n_t('error.prop.is_too_short', {property: propName, size: propDef.minimum})
			if (propDef.maximum && propValue.length > propDef.maximum )
				return i18n_t('error.prop.is_too_long',  {property: propName, size: propDef.maximum})
			if (propDef.type !== 'text' && propValue.includes('\n'))
				return i18n_t('error.prop.string_contains_line_feeds',  {property: propName, size: propDef.maximum})
			return false // no error
		case 'email':
			if (typeof(propValue) !== 'string' )
				return i18n_t('error.prop.is_not_a_string', {property: propName})
			if (propDef.minimum && propValue.length < propDef.minimum )
				return i18n_t('error.prop.is_too_short', {property: propName, size: propDef.minimum})
			if (propDef.maximum && propValue.length > propDef.maximum )
				return i18n_t('error.prop.is_too_long',  {property: propName, size: propDef.maximum})
			if (value.match(/\S+@\S+\.\S+/) === null)
				return i18n_t('error.prop.is_malformed_email', {property: 'email'})
			return false // no error
		case 'date':
		case 'datetime':
			if (typeof(propValue) !== 'object')
				return i18n_t('error.prop.is_not_a_date', {property: propName})
			if (propValue.constructor.name !== 'date')
				return i18n_t('error.prop.is_not_a_date', {property: propName})
			return false // no error
		case 'boolean':
			if (typeof(propValue) !== 'boolean')
				return i18n_t('error.prop.is_not_a_boolean', {property: propName})
			return false // no error
		default:
			throw new Error(`Property type [${propDef.type}] not supported`)
	}
}

export {
	controlObject,
	controlObjectProperty
}
