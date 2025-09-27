// import {
// 	catchError,
// 	runJXA,
// } from '@umac-js/utils'

import { execute } from './_shared'

export class Say {

	async run( text: string ) {

		return await execute( `say "${text}"` )
		// const [ _e, res ] = await catchError( ( async () => {

		// 	return await runJXA<string>(
		// 		text => {

		// 			try {

		// 				// @ts-ignore
		// 				const app                    = Application.currentApplication()
		// 				app.includeStandardAdditions = true

		// 				return app.say( text )

		// 			}
		// 			catch ( _e ) {

		// 				return undefined

		// 			}

		// 		},
		// 		text,
		// 	)

		// } )() )

		// return res

	}

}

