import { execute } from './_shared'

export class Sleep {

	/**
	 * Immediately put the system to sleep.
	 *
	 * @param   {boolean}         force - Whether or not to force the sleep.
	 * @returns {Promise<string>}       - The output of the command.
	 * @example
	 * await this.now()
	 */
	async now( force: boolean = false ) {

		const status = await this.getStatus()

		if ( !status && !force ) throw new Error( 'Sleep mode is not enabled. You must enable it or force it' )
		else if ( force ) await this.setMode( true )

		await execute( 'sudo pmset sleepnow' )

	}

	/**
	 * Enable or disable sleep mode.
	 *
	 * @param   {boolean}         active - Whether or not to enable sleep mode.
	 * @returns {Promise<string>}        - The output of the command.
	 * @example
	 * const result = await this.setMode(true)
	 * console.log(result) // Must be true
	 */
	async setMode( active: boolean ) {

		await execute( 'sudo pmset -a disablesleep ' + ( active ? '0' : '1' ) )
		return await this.getStatus()

	}

	/**
	 * Returns whether or not sleep mode is enabled.
	 *
	 * @returns {Promise<boolean>} - True if sleep mode is enabled, false otherwise.
	 * @example
	 * const result = await this.getStatus()
	 * console.log(result) // Must be true or false
	 */
	async getStatus() {

		try {

			const data     = await execute( 'pmset -g | grep SleepDisabled' )
			const lastChar = data.trim().slice( -1 )
			return lastChar === '0'

		}
		catch ( _e ) {

			// if not found return that sleep mode is enabled, which is the default
			return true

		}

	}

}

