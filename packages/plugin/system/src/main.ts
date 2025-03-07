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
import { System } from './core'

export const CMD = {
	REBOOT   : 'reboot',
	SHUTDOWN : 'shutdown',
	UPDATE   : 'update',
	HARDWARE : 'hardware',
	VERSION  : 'version',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : `${CMD.UPDATE}, up`,
			desc  : 'System updates',
			flags : [
				{
					value : '--install, -i',
					desc  : 'Install System updates',
				},
			],
		},
		{
			value : `${CMD.SHUTDOWN}, down`,
			desc  : 'Close down the system at a given time',
		},
		{
			value : CMD.REBOOT,
			desc  : 'Reboot system',
		},
		{
			desc  : 'Show hardware information',
			value : CMD.HARDWARE,
		},
		{
			desc  : 'Show system version',
			value : CMD.VERSION,
		},
	] },
	fn : async ( {
		argv, getHelp,
	} ) => {

		const sys = new System()

		if ( argv.existsCmd( CMD.REBOOT ) )
			await sys.reboot()
		else if ( argv.existsCmd( CMD.SHUTDOWN ) || argv.existsCmd( 'down' ) )
			await sys.shutdown()
		else if ( argv.existsCmd( CMD.UPDATE ) || argv.existsCmd( 'up' ) )
			await sys.update( argv.existsFlag( 'install' ) || argv.existsFlag( 'i' ) )
		else if ( argv.existsCmd( CMD.HARDWARE ) )
			console.log( infoStyle( [ 'Hardware\n', '\n' + ( await sys.getHardwareInfo() ) ] ) )
		else if ( argv.existsCmd( CMD.VERSION ) )
			console.log( infoStyle( [ 'System Version\n', '\n' + ( await sys.getVersion() ) ] ) )
		else console.log( getHelp() )

	},
} )

export default cli
export { cli }
