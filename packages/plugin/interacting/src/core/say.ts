import {
	catchError,
	runJXA,
} from '@umac/utils'

export type AlertOpts = {
	/**
	 * Description
	 */
	desc           : string
	/**
	 * a list of up to three button names
	 */
	extraButton?   : string
	/**
	 * number of the default button
	 */
	defaultButton? : string
	/**
	 * number of the cancel button
	 */
	cancelButton?  : string

	as? : 'critical' | 'stop' | 'note'
}

export class Say {

	async run( text: string ) {

		const [ _e, res ] = await catchError( ( async () => {

			return await runJXA<string>(
				text => {

					try {

						// @ts-ignore
						const app                    = Application.currentApplication()
						app.includeStandardAdditions = true

						return app.say( text )

					}
					catch ( _e ) {

						return undefined

					}

				},
				text,
			)

		} )() )

		return res

	}

}

