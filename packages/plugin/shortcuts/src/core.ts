/* eslint-disable jsdoc/require-returns */
import { spawn } from 'node:child_process'

class ShortcutsSuper {

	protected async _exec( cmd: string ) {

		return new Promise<string>( ( resolve, reject ) => {

			const child = spawn( '/bin/sh', [ '-c', cmd ], {
				stdio : [
					'ignore',
					'pipe',
					'pipe',
				],
			} )

			let stdout = '',
				stderr = ''

			child.stdout.on( 'data', data => {

				stdout += data.toString()

			} )
			child.stderr.on( 'data', data => {

				stderr += data.toString()

			} )

			child.on( 'error', reject )
			child.on( 'close', code => {

				if ( code === 0 ) resolve( stdout.trim() )
				else reject( new Error( stderr.trim() || `Command exited with code ${code}` ) )

			} )

		} )

	}

	protected _escape( value: string ) {

		return value
			.replace( /\\/g, '\\\\' )
			.replace( /"/g, '\\"' )

	}

}
type ShortcutObject = {
	name : string
	id?  : string
}

type ListOptions = {
	folders?     : boolean
	identifiers? : boolean
	folder?      : string
}

type RunOptions = {
	input?      : string
	output?     : string
	outputType? : string
}

export class Shortcuts extends ShortcutsSuper {

	CODE = {
		SUCCESS           : 'success',
		ERROR_NONE_PARAMS : 'error-none-params',
		ERROR_NONE_TARGET : 'error-none-target',
		ERROR_NOT_MACOS   : 'error-not-macos',
	} as const

	#setResult( result: string ) {

		if ( result.startsWith( 'error' ) ) throw new Error( result )
		return

	}

	/**
	 * Lists the available shortcuts or folders.
	 *
	 * @param   {ListOptions}                          [options] - Additional options to filter or change the output.
	 * @returns {Promise<string[] | ShortcutObject[]>}           Resolves to an array of shortcut names (or objects with their id) or folder names.
	 * @example
	 * ```typescript
	 * // List shortcut names
	 * const names = await shortcuts.list()
	 *
	 * // List shortcuts with their identifiers
	 * const withIds = await shortcuts.list( { identifiers: true } )
	 *
	 * // List folders
	 * const folders = await shortcuts.list( { folders: true } )
	 *
	 * // List shortcuts of a folder
	 * const inFolder = await shortcuts.list( { folder: 'My Folder' } )
	 * ```
	 */
	async list( options: ListOptions = {} ): Promise<string[] | ShortcutObject[]> {

		const cmdParts = [ 'shortcuts', 'list' ]

		if ( options.folders ) {

			cmdParts.push( '--folders' )

		}

		if ( options.folder ) {

			cmdParts.push( '--folder-name', `"${this._escape( options.folder )}"` )

		}

		if ( options.identifiers ) {

			cmdParts.push( '--show-identifiers' )

		}

		const raw = await this._exec( cmdParts.join( ' ' ) )
		if ( !raw ) return []

		const lines = raw.split( '\n' )

		if ( options.identifiers ) {

			return lines
				.map( line => {

					const match = line.match( /^(.*) \(([0-9A-F-]+)\)$/ )
					if ( !match ) return { name: line }
					return {
						name : match[1],
						id   : match[2],
					}

				} )
				.filter( item => item.name )

		}

		return lines.filter( name => name )

	}

	/**
	 * Runs a shortcut.
	 *
	 * @param {string}     [name]    - The shortcut name or identifier.
	 * @param {RunOptions} [options] - Additional options.
	 * @example
	 * ```typescript
	 * // Run a shortcut
	 * await shortcuts.run( 'My Shortcut' )
	 *
	 * // Run a shortcut with input and output
	 * await shortcuts.run( 'Resize Image', { input: 'photo.jpg', output: 'resized.jpg' } )
	 * ```
	 */
	async run( name: string, options: RunOptions = {} ) {

		if ( !name ) return this.#setResult( this.CODE.ERROR_NONE_TARGET )

		const cmdParts = [
			'shortcuts',
			'run',
			`"${this._escape( name )}"`,
		]

		if ( options.input ) {

			cmdParts.push( '--input-path', `"${this._escape( options.input )}"` )

		}

		if ( options.output ) {

			cmdParts.push( '--output-path', `"${this._escape( options.output )}"` )

		}

		if ( options.outputType ) {

			cmdParts.push( '--output-type', this._escape( options.outputType ) )

		}

		const raw = await this._exec( cmdParts.join( ' ' ) )
		this.#setResult( raw )

		return raw || this.CODE.SUCCESS

	}

	/**
	 * Views a shortcut in the Shortcuts app.
	 *
	 * @param {string} name - The shortcut name or identifier.
	 * @example
	 * ```typescript
	 * await shortcuts.view( 'My Shortcut' )
	 * ```
	 */
	async view( name: string ) {

		if ( !name ) return this.#setResult( this.CODE.ERROR_NONE_TARGET )

		const raw = await this._exec( `shortcuts view "${this._escape( name )}"` )
		this.#setResult( raw )

		return raw || this.CODE.SUCCESS

	}

	/**
	 * Opens the Shortcuts app.
	 *
	 * @example
	 * ```typescript
	 * await shortcuts.open()
	 * ```
	 */
	async open() {

		await this._exec( 'open -a Shortcuts' )
		return this.CODE.SUCCESS

	}

}
