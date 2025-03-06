import {
	catchError,
	runJXA,
} from '@umac/utils'

export type DialogOpts = {
	/**
	 * Description
	 */
	desc           : string
	/**
	 * a list of up to three button names
	 */
	extraButton?   : string
	/**
	 * The default button NAME
	 */
	defaultButton? : string
	/**
	 * The cancel button NAME
	 */
	cancelButton?  : string
	/**
	 * the dialog window title
	 */
	title?         : string
	/**
	 * …or an alias or file reference to a file
	 */
	icon?          : 'caution' | 'stop' | 'note'
}

export class Dialog {

	async run( options: DialogOpts )  {

		const defaultButton = options.defaultButton || 'Ok'
		const cancelButton  = options.cancelButton || 'Cancel'
		const [ _e, res ]   = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html#//apple_ref/doc/uid/TP40016239-CH15-SW1
			 */
			return await runJXA<string>(
				(
					text,
					defaultButton,
					cancelButton,
					extraButton,
					withTitle,
					withIcon,
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
						if ( withIcon ) opts.withIcon = withIcon
						// @ts-ignore
						if ( withTitle ) opts.withTitle = withTitle

						const res = app.displayDialog( text, opts )
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
				options.title,
				options.icon,
			)

		} )() )

		return res === defaultButton ? true : res === cancelButton ? false : 'extra'

	}

}

