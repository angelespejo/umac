/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { exec as nodeExec } from 'node:child_process'
import process              from 'node:process'
import { createInterface }  from 'node:readline/promises'
import { promisify }        from 'node:util'

import { indent } from './string'
import {
	bold,
	customStyle,
	dim,
	ICON,
	underline,
	italic,
} from './style'

const execPromise = promisify( nodeExec )

export {
	process,
}

export type ExecResult = Awaited<ReturnType<typeof execPromise>>

export const exec = async ( cmd: string ): Promise<ExecResult> => {

	try {

		return await execPromise( cmd )

	}
	catch ( e ) {

		return {
			stderr : e as string,
			stdout : '',
		}

	}

}

/**
 * Option item for select prompts, which can be a string value or an object with an optional description.
 */
export type SelectOption = string | {
	value : string
	desc? : string
}

/**
 * Normalizes an option item into a unified object structure.
 */
const normalizeOption = ( option: SelectOption ) => {

	if ( typeof option === 'string' ) return { value: option }
	return option

}

/**
 * Base prompt handler for single and multiple selection.
 */
const promptSelectBase = async (
	question : string,
	values : SelectOption[],
	multiple : boolean,
): Promise<string | string[]> => {

	// Clone array to avoid mutating input array and append 'quit'
	const options = [ ...values, 'quit' ].map( normalizeOption )

	const rl = createInterface( {
		input  : process.stdin,
		output : process.stdout,
	} )

	console.log( underline( question ), '\n' )
	options.forEach( ( option, index ) => {

		const isQuit    = option.value === 'quit'
		const valueText = isQuit ? 'Quit' : option.value
		const descText  = option.desc ? ` ${italic( option.desc )}` : ''
		const indexText = bold( ( index + 1 ).toString() )
		const itemText  = isQuit ? dim( valueText ) : valueText

		console.log( indent( `${indexText} ${dim( itemText + descText )}` ) )

	} )
	console.log()

	const answer = await rl.question( customStyle( ICON.ARROW, [ multiple ? 'Enter choices (separated by a comma)' : 'Enter choice: ', '' ] ) )
	rl.close()

	const choices = answer
		.split( ',' )
		.map( num => parseInt( num.trim(), 10 ) - 1 )
		.filter( index => !isNaN( index ) && index >= 0 && index < options.length )

	if ( choices.includes( options.findIndex( opt => opt.value === 'quit' ) ) ) {

		process.exit( 0 )

	}

	const selectedValues = choices.map( i => options[i].value )

	return multiple ? selectedValues : selectedValues[0]

}

/**
 * Prompts the user to select a single option from a list.
 *
 * @param   {string}          question - The question/header to display.
 * @param   {SelectOption[]}  values   - Array of strings or objects with value & optional description.
 * @returns {Promise<string>}          A promise resolving to the selected option value.
 */
export const promptSelect = async ( question: string, values: SelectOption[] ): Promise<string> => {

	return await promptSelectBase( question, values, false ) as string

}

/**
 * Prompts the user to select multiple options from a list.
 *
 * @param   {string}            question - The question/header to display.
 * @param   {SelectOption[]}    values   - Array of strings or objects with value & optional description.
 * @returns {Promise<string[]>}          A promise resolving to an array of selected option values.
 */
export const promptMultipleSelect = async ( question: string, values: SelectOption[] ): Promise<string[]> => {

	return await promptSelectBase( question, values, true ) as string[]

}
