import { exec } from '@umac-js/utils'

import { Color }    from './color'
import { DarkMode } from './dark'

export class Appearance {

	darkmode = new DarkMode()
	color = new Color()

	async reloadFinder() {

		const {
			stderr, stdout,
		} = await exec( `osascript -e 'tell application "Finder" to quit' && osascript -e 'tell application "Finder" to activate'` )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

}
