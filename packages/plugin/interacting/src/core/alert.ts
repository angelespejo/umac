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

export class Alert {

	async run( options: AlertOpts ) {

		const defaultButton = options.defaultButton || 'Ok'
		const cancelButton  = options.cancelButton || 'Cancel'
		const [ _e, res ]   = await catchError( ( async () => {

			return await runJXA<string>(
				(
					text,
					defaultButton,
					cancelButton,
					extraButton,
					as,
				) => {

					try {

						// @ts-ignore
						const app                    = Application.currentApplication()
						app.includeStandardAdditions = true
						const buttons                = [ cancelButton, defaultButton ]
						// @ts-ignore
						if ( extraButton ) buttons.push( extraButton )
						const opts = {
							buttons       : buttons,
							defaultButton : defaultButton,
							cancelButton  : cancelButton,
						}
						// @ts-ignore
						if ( as ) opts.as = as

						const res = app.displayAlert( text, opts )
						return res.buttonReturned

					}
					catch ( _e ) {

						return cancelButton

					}

				},
				options.desc,
				defaultButton,
				cancelButton,
				options.extraButton,
				options.as,
			)

		} )() )

		return res === defaultButton ? true : res === cancelButton ? false : 'extra'

	}

}

