import {
	exec,
	promptSelect,
} from '@umac-js/utils'
import { env } from 'node:process'

export class Terminal {

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async getShellList() {

		const shells = ( await this.#exec( 'grep "^[^#]" /etc/shells' ) ).trim().split( '\n' )
		return shells.map( shell => shell.replace( '/bin/', '' ).trim() )

	}

	getCurrentShell(): string {

		return env.SHELL?.replace( '/bin/', '' ) || 'unknown'

	}

	async changeShell( shellName?: string ) {

		if ( !shellName ) {

			const shells = await this.getShellList()
			const curr   = await this.getCurrentShell()

			if ( shells.length === 0 ) return

			const selected = await promptSelect( 'Select a shell to change:', shells.filter( d => d !== curr ) )

			shellName = selected

		}

		const shellPath = `/bin/${shellName}`

		return await this.#exec( `chsh -s ${shellPath}` )

	}

	async open() {

		return await this.#exec( 'open -a Terminal' )

	}

}

