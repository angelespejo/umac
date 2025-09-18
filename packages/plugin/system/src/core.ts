import { exec } from '@umac-js/utils'

export class System {

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async reboot() {

		await this.#exec( 'reboot' )

	}

	async getHardwareInfo() {

		const data = await this.#exec( 'system_profiler SPHardwareDataType' )
		try {

			return data.split( 'Hardware Overview:' )[1].split( '\n' ).map( d => d.trim() ).join( `\n` ).trim()

		}
		catch ( _e ) {

			return data

		}

	}

	async shutdown() {

		await this.#exec( 'shutdown now' )

	}

	async update( install: boolean ) {

		const command = `softwareupdate -l ${install ?? '-i'}`.trim()
		return await this.#exec( command )

	}

	async getVersion() {

		return await this.#exec( 'sw_vers' )

	}

	/**
	 * Immediately put the system to sleep.
	 *
	 * @param   {boolean}         force - Whether or not to force the sleep.
	 * @returns {Promise<string>}       - The output of the command.
	 * @example
	 * await this.sleep()
	 */
	async sleep( force: boolean = false ) {

		const status = await this.getSleepStatus()

		if ( !status && !force ) throw new Error( 'Sleep mode is not enabled. You must enable it or force it' )
		else if ( force ) await this.sleepMode( true )

		await this.#exec( 'sudo pmset sleepnow' )

	}

	/**
	 * Enable or disable sleep mode.
	 *
	 * @param   {boolean}         active - Whether or not to enable sleep mode.
	 * @returns {Promise<string>}        - The output of the command.
	 * @example
	 * const result = await this.sleepMode(true)
	 * console.log(result) // Must be true
	 */
	async sleepMode( active: boolean ) {

		await this.#exec( 'sudo pmset -a disablesleep ' + ( active ? '0' : '1' ) )
		return await this.getSleepStatus()

	}

	/**
	 * Returns whether or not sleep mode is enabled.
	 *
	 * @returns {Promise<boolean>} - True if sleep mode is enabled, false otherwise.
	 * @example
	 * const result = await this.getSleepStatus()
	 * console.log(result) // Must be true or false
	 */
	async getSleepStatus() {

		const data     = await this.#exec( 'pmset -g | grep SleepDisabled' )
		const lastChar = data.trim().slice( -1 )
		return lastChar === '0'

	}

}

