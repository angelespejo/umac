import { matcher } from 'matcher'

import {
	isPath,
	readFile,
} from './sys'

export const getMatch = matcher

/**
 * Indents a given string by prefixing each line with a given prefix
 * (default is two spaces).
 *
 * @param   {string} v        - The string to indent.
 * @param   {string} [prefix] - The prefix to prepend to each line (default is two spaces).
 * @returns {string}          - The indented string.
 */
export const indent = ( v:string, prefix = '  ' ) =>
	v.split( '\n' ).map( line => `${prefix}${line}` ).join( '\n' )

/**
 * Capitalizes the first letter of a word.
 *
 * @param   {string} s - The word to capitalize.
 * @returns {string}   - The capitalized word.
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
 *
 * @param   {string[]} parts - The URL parts to join.
 * @returns {string}         - The joined URL string.
 */
export const joinUrl = ( ...parts: string[] ) => {

	parts = parts.map( part => part.replace( /^\/+|\/+$/g, '' ) )

	return parts.join( '/' )

}

/**
 * Fetch content from a URL to string.
 *
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
		throw new Error( `Fetching URL Error: ${error.message}`, { cause: error } )

	}

}

export const getInputString = async ( input: string ) => {

	const type = getStringType( input )

	if ( type === 'path' ) return await readFile( input, 'utf-8' )
	if ( type === 'url' ) return await fetch2string( input )
	return input

}

/**
 * Formatting options for byte conversion.
 */
export type FormatBytesOptions = {
	/**
	 * Number of decimal places to include.
	 *
	 * @default 2
	 */
	decimals? : number
	/**
	 * Whether to use binary units (1024 / KiB, MiB) or decimal units (1000 / KB, MB).
	 *
	 * @default true
	 */
	binary?   : boolean
}

/**
 * Converts a byte number into a human-readable size string (e.g., "1.5 MB", "2.34 GB").
 *
 * @param   {number}             bytes   - The number of bytes to format.
 * @param   {FormatBytesOptions} options - Formatting options for precision and binary standard.
 * @returns {string}                     Human-readable formatted string.
 */
export const formatBytes = ( bytes: number, options: FormatBytesOptions = {} ): string => {

	const {
		decimals = 2, binary = true,
	} = options

	if ( bytes === 0 || isNaN( bytes ) ) return '0 B'

	const k     = binary ? 1024 : 1000
	const dm    = decimals < 0 ? 0 : decimals
	const units = binary
		? [
			'B',
			'KiB',
			'MiB',
			'GiB',
			'TiB',
			'PiB',
		]
		: [
			'B',
			'KB',
			'MB',
			'GB',
			'TB',
			'PB',
		]

	const i     = Math.floor( Math.log( Math.abs( bytes ) ) / Math.log( k ) )
	const index = Math.min( i, units.length - 1 )

	const value = ( bytes / Math.pow( k, index ) ).toFixed( dm )

	return `${parseFloat( value )} ${units[index]}`

}
