import { Updater } from '@clippium/updater'
import { color }   from '@umac-js/utils'

import {
	name,
	version,
} from './const'

export const updater = async ( ) => {

	const _updater = new Updater( {
		version,
		name,
	} )

	const data = await _updater.get()
	if ( !data ) return

	console.log( `\n\n║ 📦 ${color.bold( 'Update available' )} ${color.dim( data.currentVersion )} → ${color.green( data.latestVersion )} ${color.italic( `(${data.type})` )}
║ Run ${color.blue( data.packageManager + ' i ' + name )} to update
		` )

}
