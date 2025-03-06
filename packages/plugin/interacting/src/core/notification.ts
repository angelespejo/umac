import {
	catchError,
	runJXA,
} from '@umac/utils'

export type NotificationOpts = {
	desc      : string
	title?    : string
	subtitle? : string
	/**
	 * ls /System/Library/Sounds
	 */
	sound     : 'Basso' | 'Blow' | 'Bottle' | 'Frog' | 'Funk'
		| 'Glass' | 'Hero' | 'Morse' | 'Ping' | 'Pop'
		| 'Purr' | 'Sosumi' | 'Submarine' | 'Tink'
}
export class Notification {

	async run( options: NotificationOpts ) {

		const [ _e, res ] = await catchError( ( async () => {

			return await runJXA<string>(
				(
					desc,
					title,
					subtitle,
					sound,
				) => {

					try {

						// @ts-ignore
						const app = Application.currentApplication()

						app.includeStandardAdditions = true
						const opts                   = {}
						// @ts-ignore
						if ( title ) opts.withTitle = title
						// @ts-ignore
						if ( subtitle ) opts.subtitle = subtitle
						// @ts-ignore
						if ( sound ) opts.soundName = sound
						return app.displayNotification( desc, opts )

					}
					catch ( _e ) {

						return false

					}

				},
				options.desc,
				options.title,
				options.subtitle,
				options.sound,
			)

		} )() )

		return res

	}

}

