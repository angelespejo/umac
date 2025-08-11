import {
	infoStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Spotlight } from './core'

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value      : 'path',
				posicional : true,
				desc       : 'Custom route of your system',
			},
		],
		flags : [
			{
				value : '--toggle',
				desc  : 'Toggle',
			},
			{
				value : '--enable',
				desc  : 'Enable',
			},
			{
				value : '--disable',
				desc  : 'Disable',
			},
		],
	},
	fn : async ( { argv } ) => {

		const spotlight = new Spotlight()
		const path      = argv.getPositionalAt( 0 ) || '/'
		const flag      = argv.existsFlag( 'disable' )
			? false
			: argv.existsFlag( 'enable' )
				? true
				: argv.existsFlag( 'toggle' )
					? 'toggle'
					: 'status'

		const status = ( flag === 'status' )
			? await spotlight.status( path )
			: await spotlight.activate( flag, path )

		console.log( infoStyle( [ `Spotlight (${path}):`, status ? 'enabled' : 'disable' ] ) )

	},
} )

export default cli
export { cli }
