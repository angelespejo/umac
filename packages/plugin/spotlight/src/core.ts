import { exec } from '@umac-js/utils'

export class Spotlight {

	async #exec( cmd:string ) {

		const {
			stderr, stdout,
		} = await exec( cmd )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async status( part: string = '/' ) {

		const res = await this.#exec( `mdutil -s ${part}` )

		return res.toString().trim().endsWith( 'enabled.' )

	}

	async activate( option: boolean | 'toggle', part: string = '/' ) {

		if ( option === 'toggle' ) option = !( await this.status( part ) )

		const command = `mdutil -i ${option ? 'on' : 'off'} ${part}`

		return await this.#exec( command )

	}

}

