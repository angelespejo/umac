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
} from './style'

const execPromise = promisify( nodeExec )

export { process }

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

const promptSelectBase = async ( question: string, values: string[], multiple: boolean ): Promise<string | string[]> => {

	values.push( 'quit' )

	const rl = createInterface( {
		input  : process.stdin,
		output : process.stdout,
	} )

	console.log( underline( question ), '\n' )
	values.forEach( ( option, index ) =>
		console.log( indent( `${bold( ( index + 1 ).toString() )} ${dim( option === 'quit' ? 'Quit' : option )}` ) ),
	)
	console.log( )

	const answer = await rl.question( customStyle( ICON.ARROW, [ multiple ? 'Enter choices (separated by a comma)' : 'Enter choice: ', '' ] ) )
	rl.close()

	const choices = answer
		.split( ',' )
		.map( num => parseInt( num.trim(), 10 ) - 1 )
		.filter( index => !isNaN( index ) && index >= 0 && index < values.length )

	if ( choices.includes( values.indexOf( 'quit' ) ) ) {

		process.exit( 0 )

	}

	return multiple ? choices.map( i => values[i] ) : values[choices[0]]

}

export const promptSelect = async ( question: string, values: string[] ): Promise<string> => {

	return await promptSelectBase( question, values, false ) as string

}

export const promptMultipleSelect = async ( question: string, values: string[] ): Promise<string[]> => {

	return await promptSelectBase( question, values, true ) as string[]

}
