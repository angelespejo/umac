
import { execute } from './_shared'

export class Core {

	/**
	 * Immediately reboot the system.
	 *
	 * @returns {Promise<void>} - The output of the command.
	 * @example
	 * await this.reboot()
	 */
	async reboot() {

		await execute( 'reboot' )

	}

	/**
	 * Immediately shut down the system.
	 *
	 * @returns {Promise<void>} - The output of the command.
	 * @example
	 * await this.shutdown()
	 */
	async shutdown() {

		await execute( 'shutdown now' )

	}

	/**
	 * Updates the system.
	 *
	 * @returns {Promise<void>}
	 */
	async update( ) {

		return await execute( `softwareupdate -i` )

	}

	/**
	 * Checks for available system updates.
	 *
	 * @returns {Promise<string>} - The output of the command.
	 */
	async getUpdate( ) {

		return await execute( `softwareupdate -l` )

	}

	/**
	 * Checks for the system update history.
	 *
	 * @returns {Promise<string>} - The output of the command.
	 */
	async getUpdateHistory( ) {

		return await execute( `softwareupdate -l --history` )

	}

	/**
	 * Gets the system version.
	 *
	 * @returns {Promise<string>} - The system version.
	 */
	async getVersion() {

		return await execute( 'sw_vers' )

	}

}

