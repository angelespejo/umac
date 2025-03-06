import {
	catchError,
	runJXA,
} from '@umac/utils'

import { DialogOpts } from './dialog'

/**
 * Idea From [@jsa/types](https://github.com/JXA-userland/JXA/blob/95e0cd572177c2de29a071ccbfd270f6155c52b2/packages/%40jxa/types/src/core/StandardAdditions.d.ts#L406)
 */
export type PromptColorOpt = { defaultColor?: [number, number, number] }

/**
 * Idea From [@jsa/types](https://github.com/JXA-userland/JXA/blob/95e0cd572177c2de29a071ccbfd270f6155c52b2/packages/%40jxa/types/src/core/StandardAdditions.d.ts#L502)
 */
export type PromptSelectOpt = {
	items          : string[]
	desc           : string
	defaultItems?  : string[]
	/**
	 * the dialog window title
	 */
	title?         : string
	/**
	 * The default button NAME
	 */
	defaultButton? : string
	/**
	 * The cancel button NAME
	 */
	cancelButton?  : string
	/**
	 * Allow multiple items to be selected?
	 */
	multiple?      : boolean
	/**
	 * Can the user make no selection and then choose OK?
	 */
	empty?         : boolean

}

/**
 * Idea from [@jxa/types](https://github.com/JXA-userland/JXA/blob/95e0cd572177c2de29a071ccbfd270f6155c52b2/packages/%40jxa/types/src/core/StandardAdditions.d.ts#L419)
 */
export type PromptFileOpt = {
	/**
	 * the prompt to be displayed in the dialog box
	 */
	title?                  : string
	/**
	 * a list of file types or type identifiers. Only files of the specified types will be selectable.
	 * @example ['png']
	 */
	types?                  : string[]
	/**
	 * the default file location
	 */
	defaultLocation?        : string
	/**
	 * Show invisible files and folders?
	 * @default false
	 */
	dotfiles?               : boolean
	/**
	 * Allow multiple items to be selected?
	 * @default false
	 */
	multiple?               : boolean
	/**
	 * Show the contents of packages? (Packages will be treated as folders)
	 * @default false
	 */
	showingPackageContents? : boolean
}

/**
 * Idea from [@jxa/types](https://github.com/JXA-userland/JXA/blob/95e0cd572177c2de29a071ccbfd270f6155c52b2/packages/%40jxa/types/src/core/StandardAdditions.d.ts#L473)
 */
export type PromptFolderOpt = {
	/**
	 * the prompt to be displayed in the dialog box
	 */
	title?                  : string
	/**
	 * the default file location
	 */
	defaultLocation?        : string
	/**
	 * Show invisible files and folders?
	 * @default false
	 */
	dotfiles?               : boolean
	/**
	 * Allow multiple items to be selected?
	 * @default false
	 */
	multiple?               : boolean
	/**
	 * Show the contents of packages? (Packages will be treated as folders)
	 * @default false
	 */
	showingPackageContents? : boolean
}

export type PromptInputOpt = DialogOpts & {
	defaultValue? : string
	hidden?       : boolean
}
export class Prompt {

	async select( options: PromptSelectOpt ) {

		const [ _e, res ] = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/PromptforaChoicefromaList.html#//apple_ref/doc/uid/TP40016239-CH83-SW1
			 */
			return await runJXA<string>(
				(
					list,
					desc,
					defaultItems,
					withTitle,
					OKButtonName,
					cancelButtonName,
					multipleSelectionsAllowed,
					emptySelectionAllowed,
				) => {

					try {

						// @ts-ignore
						const app                    = Application.currentApplication()
						app.includeStandardAdditions = true

						const fruitChoices = list
						const opts         = { withPrompt: desc }
						// @ts-ignore
						if ( defaultItems && defaultItems !== null ) opts.defaultItems = defaultItems
						// @ts-ignore
						if ( withTitle && withTitle !== null ) opts.withTitle = withTitle
						// @ts-ignore
						if ( OKButtonName && OKButtonName !== null ) opts.OKButtonName = OKButtonName
						// @ts-ignore
						if ( cancelButtonName && cancelButtonName !== null ) opts.cancelButtonName = cancelButtonName
						// @ts-ignore
						if ( multipleSelectionsAllowed && multipleSelectionsAllowed !== null ) opts.multipleSelectionsAllowed = multipleSelectionsAllowed
						// @ts-ignore
						if ( emptySelectionAllowed && emptySelectionAllowed !== null ) opts.emptySelectionAllowed = emptySelectionAllowed

						return app.chooseFromList( fruitChoices, opts )

					}
					catch ( _e ) {

						return undefined

					}

				},
				options.items,
				options.desc,
				options.defaultItems,
				options.title,
				options.defaultButton,
				options.cancelButton,
				options.multiple,
				options.empty,
			)

		} )() )

		return res

	}

	async color( option?: PromptColorOpt ) {

		const [ _e, res ] = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/PromptforaColor.html#//apple_ref/doc/uid/TP40016239-CH86-SW1
			 */
			return await runJXA<string>( defaultColor => {

				try {

					// @ts-ignore
					const app                    = Application.currentApplication()
					app.includeStandardAdditions = true
					if ( !defaultColor ) return app.chooseColor(  )
					else return app.chooseColor( { defaultColor } )

				}
				catch ( _e ) {

					return undefined

				}

			}, option?.defaultColor )

		} )() )
		return res

	}

	async input( options: PromptInputOpt ): Promise<{
		button : true | 'extra'
		value  : string
	} | undefined> {

		const defaultButton = options.defaultButton || 'Ok'
		const cancelButton  = options.cancelButton || 'Cancel'
		const defaultAnswer = options.defaultValue || ''
		const hiddenAnswer  = options.hidden || false
		const [ _e, res ]   = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayDialogsandAlerts.html#//apple_ref/doc/uid/TP40016239-CH15-SW1
			 */
			const res = await runJXA<{
				buttonReturned : string
				textReturned   : string
			}>(
				(
					text,
					defaultButton,
					cancelButton,
					extraButton,
					withTitle,
					withIcon,
					defaultAnswer,
					hiddenAnswer,
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
							defaultAnswer : defaultAnswer,
							hiddenAnswer  : hiddenAnswer,
						}
						// @ts-ignore
						if ( withIcon ) opts.withIcon = withIcon
						// @ts-ignore
						if ( withTitle ) opts.withTitle = withTitle

						return app.displayDialog( text, opts )

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
				defaultAnswer,
				hiddenAnswer,
			)

			// @ts-ignore
			return  res === cancelButton || res.buttonReturned === cancelButton
				? undefined
				: {
					button : res.buttonReturned === defaultButton
						? true as const
						: 'extra' as const,
					value : res.textReturned,
				}

		} )() )

		return res

	}

	async file( options?: PromptFileOpt ) {

		const [ _e, res ] = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/PromptforaFileorFolder.html#//apple_ref/doc/uid/TP40016239-CH81-SW1
			 */
			return await runJXA<string[]>( (
				withPrompt,
				ofType,
				defaultLocation,
				invisibles,
				multipleSelectionsAllowed,
				showingPackageContents,
			) => {

				try {

					// @ts-ignore
					const app                    = Application.currentApplication()
					app.includeStandardAdditions = true
					const opts                   = {
						invisibles,
						multipleSelectionsAllowed,
						showingPackageContents,
					}

					// @ts-ignore
					if ( withPrompt && withPrompt !== null ) opts.withPrompt = withPrompt
					// @ts-ignore
					if ( ofType && ofType !== null ) opts.ofType = ofType
					// @ts-ignore
					if ( defaultLocation && defaultLocation !== null ) opts.defaultLocation = defaultLocation
					const path  = app.chooseFile( opts )
					const paths = typeof path === 'string' ?  [ path ] : path
					// @ts-ignore
					return paths.map( v => v.toString() )

				}
				catch ( _e ) {

					return undefined

				}

			},
			options?.title,
			options?.types,
			options?.defaultLocation,
			options?.dotfiles || false,
			options?.multiple || false,
			options?.showingPackageContents || false,
			)

		} )() )

		return res

	}

	async folder( options?: PromptFolderOpt ) {

		const [ _e, res ] = await catchError( ( async () => {

			/**
			 * @see https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/PromptforaFileorFolder.html#//apple_ref/doc/uid/TP40016239-CH81-SW1
			 */
			return await runJXA<string[]>( (
				withPrompt,
				defaultLocation,
				invisibles,
				multipleSelectionsAllowed,
				showingPackageContents,
			) => {

				try {

					// @ts-ignore
					const app                    = Application.currentApplication()
					app.includeStandardAdditions = true
					const opts                   = {
						invisibles,
						multipleSelectionsAllowed,
						showingPackageContents,
					}

					// @ts-ignore
					if ( withPrompt && withPrompt !== null ) opts.withPrompt = withPrompt
					// @ts-ignore
					if ( defaultLocation && defaultLocation !== null ) opts.defaultLocation = defaultLocation
					const path  = app.chooseFolder( opts )
					const paths = typeof path === 'string' ?  [ path ] : path
					// @ts-ignore
					return paths.map( v => v.toString() )

				}
				catch ( _e ) {

					return undefined

				}

			},
			options?.title,
			options?.defaultLocation,
			options?.dotfiles || false,
			options?.multiple || false,
			options?.showingPackageContents || false,
			)

		} )() )

		return res

	}

}
