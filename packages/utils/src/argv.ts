export class Argv {

	constructor( public args: string[] ) {}

	/**
	 * Checks if the number of options is less than or equal to 2.
	 * @returns {boolean} True if options exist, false otherwise.
	 */
	existsOpts(): boolean {

		return this.args.length <= 2

	}

	/**
	 * Returns the binary file name or command name.
	 * @returns {string} The binary or command name.
	 */
	getBin(): string {

		return this.args[0]

	}

	/**
	 * Retrieves the value of a command based on the provided key.
	 * Supports formats like `--key=value` and `--key value`.
	 * @param {string} key The command key to search for.
	 * @returns {string | undefined} The command value if found, otherwise undefined.
	 */
	getCmd( key: string ): string | undefined {

		const flags = this.args
		for ( let i = 0; i < flags.length; i++ ) {

			const flag = flags[i]

			if ( flag.startsWith( `${key}=` ) ) {

				return flag.split( '=' )[1]

			}

			if ( flag === key && flags[i + 1] && !flags[i + 1].startsWith( '-' ) ) {

				return flags[i + 1]

			}

		}
		return undefined

	}

	/**
	 * Retrieves multiple values for a command based on the provided key.
	 * Supports formats like `--key=value1,value2,...` and `--key value1 value2 ...`.
	 * @param {string} key The command key to search for.
	 * @returns {string[] | undefined} Array of command values if found, otherwise undefined.
	 */
	getCmdValues( key: string ): string[] | undefined {

		let values: string[] = []
		const flags          = this.args

		for ( let i = 0; i < flags.length; i++ ) {

			const flag = flags[i]

			if ( flag.startsWith( `${key}=` ) ) {

				values = flag.split( '=' )[1].split( ',' )
				break

			}

			if ( flag === key ) {

				for ( let j = i + 1; j < flags.length; j++ ) {

					if ( flags[j].startsWith( '-' ) ) break
					values.push( flags[j] )

				}
				break

			}

		}

		return values.length > 0 ? values : undefined

	}

	/**
	 * Checks if there are any positional arguments.
	 * @returns {boolean} True if positional arguments exist, false otherwise.
	 */
	existsPositional(): boolean {

		return this.getPositional().length > 0

	}

	/**
	 * Retrieves all positional arguments (those not prefixed with `-`).
	 * @returns {string[]} Array of positional arguments.
	 */
	getPositional(): string[] {

		return this.args.filter( arg => !arg.startsWith( '-' ) )

	}

	/**
	 * Retrieves a positional argument at the specified index.
	 * @param {number} position The index of the positional argument.
	 * @returns {string | undefined} The positional argument or undefined if not found.
	 */
	getPositionalAt( position: number ): string | undefined {

		return this.getPositional()[position]

	}

	getCmds(  ): string[] | undefined {

		const res = this.args.filter( d => !d.startsWith( '-' ) )
		if ( !res.length ) return undefined
		return res

	}

	/**
	 * Checks if a specific command exists.
	 * @param {string} cmd The command to search for.
	 * @returns {boolean} True if the command exists, false otherwise.
	 */
	existsCmd( cmd: string ): boolean {

		return this.args.includes( cmd )

	}

	/**
	 * Retrieves the value of a flag based on its key.
	 * @param {string} key The flag key to search for.
	 * @returns {string | undefined} The flag value if found, otherwise undefined.
	 */
	getFlagValue( key: string ): string | undefined {

		const flagLine = key.length === 1 ? '-' : '--'
		return this.getCmd( `${flagLine}${key}` )

	}

	/**
	 * Retrieves multiple values for a flag based on its key.
	 * @param {string} key The flag key to search for.
	 * @returns {string[] | undefined} Array of flag values if found, otherwise undefined.
	 */
	getFlagValues( key: string ): string[] | undefined {

		const flagLine = key.length === 1 ? '-' : '--'
		return this.getCmdValues( `${flagLine}${key}` )

	}

	/**
	 * Checks if a specific flag exists.
	 * @param {string} key The flag key to search for.
	 * @returns {boolean} True if the flag exists, false otherwise.
	 */
	existsFlag( key: string ): boolean {

		const flagLine = key.length === 1 ? '-' : '--'
		return this.args.includes( `${flagLine}${key}` )

	}

}
