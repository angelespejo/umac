import {
	successStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Cache } from './core'

export const CMD = {
	OPEN   : 'open',
	REMOVE : 'rm',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : CMD.OPEN,
			desc  : 'Open cache dir',
		},
		{
			value : CMD.REMOVE,
			desc  : 'Remove cache dir or path',
		},
	] },
	fn : async ( { argv } ) => {

		const cache = new Cache()
		if ( argv.existsCmd( CMD.OPEN ) ) {

			await cache.openDir()
			console.log( successStyle( [ 'Cache dir', 'Succesfully opened!' ] ) )

		}
		else if ( argv.existsCmd( CMD.REMOVE ) ) {

			const res = await cache.askForRemove()
			console.log( successStyle( [ `Cache dir (${res})`, 'Succesfully removed!' ] ) )

		}

	},
} )

export default cli
export { cli }
