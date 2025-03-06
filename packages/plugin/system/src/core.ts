import { exec } from '@umac/utils'

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

}

