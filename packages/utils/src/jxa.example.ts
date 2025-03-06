import { catchError } from './error'
import { runJXA }     from './jxa'

type Dialog = {
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
	/**
	 * the dialog window title
	 */
	title?         : string
	/**
	 * …or an alias or file reference to a file
	 */
	icon?          : 'caution' | 'stop' | 'note'
}

const runDialog = async ( dialogOpts: Dialog ) => {

	const defaultButton = dialogOpts.defaultButton || 'Ok'
	const cancelButton  = dialogOpts.cancelButton || 'Cancel'
	const [ _e, res ]   = await catchError( ( async () => {

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
			dialogOpts.desc,
			defaultButton,
			cancelButton,
			dialogOpts.extraButton,
			dialogOpts.title,
			dialogOpts.icon,
		)

	} )() )

	return res === defaultButton ? true : res === cancelButton ? false : 'extra'

}

const res = await runDialog( {
	desc          : 'HOLA QUE TAL',
	defaultButton : 'OK',
	cancelButton  : 'Cancel',
	title         : 'Hola',
	icon          : 'stop',
} )
console.log( { res } )
