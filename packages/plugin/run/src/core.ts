import {
	getInputString,
	runJXACode,
} from '@umac-js/utils'
import { spawn } from 'node:child_process'

export class Run {

	async #getInput( input: string ) {

		return await getInputString( input )

	}

	async #exec( cmd: string ) {

		await spawn( cmd, {
			shell : true,
			stdio : 'inherit',
		} )

	}

	async python( input: string ) {

		const code = await this.#getInput( input )
		return await this.#exec( `python3 -c ${JSON.stringify( code )}` )

	}

	async node( input: string ) {

		const code = await this.#getInput( input )

		return await this.#exec( `node -e ${JSON.stringify( code )}` )

	}

	async jxa( input: string ) {

		const code = await this.#getInput( input )
		console.log( await runJXACode( code ) )

	}

	async bash( input: string ) {

		const code = await this.#getInput( input )
		return await this.#exec( `bash -c ${JSON.stringify( code )}` )

	}

	async osascript( input: string ) {

		const code = await this.#getInput( input )
		return await this.#exec( `osascript -e ${JSON.stringify( code )}` )

	}

}
