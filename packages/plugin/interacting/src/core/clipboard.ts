import { spawn } from 'node:child_process'

import { execute } from './_shared'

export class Clipboard {

	/**
	 * Reads the current clipboard content.
	 *
	 * @returns {Promise<string>} - The clipboard content.
	 * @example
	 * const content = await clipboard.read()
	 * console.log( content )
	 */
	async read(): Promise<string> {

		return ( await execute( 'pbpaste' ) ).trim()

	}

	/**
	 * Writes text to the clipboard.
	 *
	 * @param {string} text - The text to copy.
	 * @example
	 * await clipboard.write( 'Hello world!' )
	 */
	write( text: string ): Promise<void> {

		return new Promise( ( resolve, reject ) => {

			const child = spawn( 'pbcopy' )

			let stderr = ''
			child.stderr.on( 'data', data => {

				stderr += data.toString()

			} )

			child.on( 'error', reject )
			child.on( 'close', code => {

				if ( code === 0 ) resolve()
				else reject( new Error( stderr.trim() || `Command exited with code ${code}` ) )

			} )

			child.stdin.write( text )
			child.stdin.end()

		} )

	}

}
