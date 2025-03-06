import { matcher } from 'matcher'

import {
	isPath,
	readFile,
} from './sys'

export const getMatch = matcher

/**
 * Indents a given string by prefixing each line with a given prefix
 * (default is two spaces).
 * @param {string} v - The string to indent.
 * @param {string} [prefix] - The prefix to prepend to each line (default is two spaces).
 * @returns {string} - The indented string.
 */
export const indent = ( v:string, prefix = '  ' ) =>
	v.split( '\n' ).map( line => `${prefix}${line}` ).join( '\n' )

/**
 * Capitalizes the first letter of a word.
 * @param {string} s - The word to capitalize.
 * @returns {string} - The capitalized word.
 */
export const capitalize = ( s: string ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 )

export const getStringType = ( value: string ): 'text' | 'url' | 'path' => {

	if ( isUrl( value ) ) return 'url'
	if ( isPath( value ) ) return 'path'
	return 'text'

}

const isUrl = ( value: string ): boolean => {

	try {

		new URL( value )
		return true

	}
	catch {

		return false

	}

}

/**
 * Joins the given URL parts into a single string.
 * @param {string[]} parts - The URL parts to join.
 * @returns {string} - The joined URL string.
 */
export const joinUrl = ( ...parts: string[] ) => {

	parts = parts.map( part => part.replace( /^\/+|\/+$/g, '' ) )

	return parts.join( '/' )

}

/**
 * Fetch content from a URL to string.
 * @param   {string}          url - URL of the resource.
 * @returns {Promise<string>}     - The fetched content.
 * @throws {Error} If there is an error fetching content from the URL.
 * @example import { fetch2string } from '@dovenv/utils'
 *
 * const imageData = await fetch2string('https://source.unsplash.com/random')
 * console.log(imageData)
 */
export async function fetch2string( url: string ): Promise<string> {

	try {

		const response    = await fetch( url )
		const contentType = response.headers.get( 'content-type' )

		if ( contentType?.includes( 'image' ) ) {

			const buffer       = Buffer.from( await response.arrayBuffer() )
			const base64String = buffer.toString( 'base64' )
			const dataUri      = `data:image/jpeg;base64,${base64String}`
			return dataUri

		}
		else {

			const text = await response.text()
			return text

		}

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Fetching URL Error: ${error.message}` )

	}

}

export const getInputString = async ( input: string ) => {

	const type = getStringType( input )

	if ( type === 'path' ) return await readFile( input, 'utf-8' )
	if ( type === 'url' ) return await fetch2string( input )
	return input

}
