
import { execute } from './_shared'

export class Info {

	#text2flag( name: string ) {

		return name.slice( 2, -8 )

	}

	#flag2text( name: string ) {

		return `SP${name}DataType`

	}

	/**
	 * Check if a type exists in the system_profiler dataTypes list.
	 *
	 * @param   {string}           type - The type to check
	 * @returns {Promise<boolean>}      - true if the type exists, false otherwise
	 */
	async exists( type: string ) {

		return this.list( ).then( list => list.includes( type ) )

	}

	/**
	 * List all system_profiler dataTypes.
	 *
	 * @returns {Promise<string[]>} - A list of all system_profiler dataTypes.
	 */
	async list( ) {

		const output = await execute( `system_profiler -listDataTypes` )
		const lines  = output.split( '\n' )

		const res = lines
			.map( line => line.trim() )
			.filter( line => line.startsWith( 'SP' ) && line.endsWith( 'DataType' ) )

		return res.map( this.#text2flag )

	}

	/**
	 * Get system_profiler data for given types.
	 *
	 * @param   {string[]}        type     - The types of data to retrieve
	 * @param   {string}          [format] - The format of the output data. Available options: 'json', 'raw'. Default: 'raw'
	 * @returns {Promise<string>}          - The data for the given types in the specified format
	 * @throws {Error} - If any of the types do not exist
	 */
	async get( type: string[], format: 'json' | 'raw' = 'raw' ) {

		if ( type?.length ) await Promise.all( type.map( async t => {

			if ( !await this.exists( t ) ) throw new Error( `Type ${t} not found` )

		} ) )

		const cmd = `system_profiler${type ? ` ${type.map( t => this.#flag2text( t ) ).join( ' ' )}` : ''}${format === 'json' ? ' -json' : ''}`

		const output = await execute( cmd )
		if ( format === 'json' ) return output.trim()
		return output

	}

}
