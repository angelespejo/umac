import { exec } from '@umac-js/utils'

export class DarkMode {

	#app = 'System Events'
	#target = 'appearance preferences'
	#property = 'dark mode'

	async #getOSAProperties() {

		const {
			stdout, stderr,
		} = await exec( `osascript -e 'tell application "${this.#app}" to get ${this.#property} of ${this.#target}'` )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString().trim() === 'true' ? true : false

	}

	async #setOSAProperties( value: boolean ) {

		const {
			stdout, stderr,
		} =  await exec(  `osascript -e 'tell application "${this.#app}" to set ${this.#property} of ${this.#target} to ${value}'` )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout

	}

	async toggle() {

		const status = await this.#getOSAProperties()

		return await this.#setOSAProperties( !status )

	}

	async getStatus() {

		return  await this.#getOSAProperties()

	}

	async enable() {

		return await this.#setOSAProperties( true )

	}

	async disable() {

		return await this.#setOSAProperties( false )

	}

}
