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
	REBOOT    : 'reboot',
	SHUTDOWN  : 'shutdown',
	UPDATE    : 'update',
	HARDWARE  : 'hardware',
	VERSION   : 'version',
	SLEEP     : 'sleep',
	SLEEP_NOW : 'sleep-now',
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
		{
			desc  : 'Sleep system now',
			value : CMD.SLEEP_NOW,
			flags : [
				{
					value : '--force',
					desc  : 'Force sleep',
				},
			],
		},
		{
			value : CMD.SLEEP,
			desc  : 'Sleep mode utilities. toggle, set, get...',
			flags : [
				{
					value : '--toggle',
					desc  : 'Toggle sleep mode',
				},
				{
					value : '--enable',
					desc  : 'Enable sleep mode',
				},
				{
					value : '--disable',
					desc  : 'Disable sleep mode',
				},
			],
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
		else if ( argv.existsCmd( CMD.SLEEP_NOW ) )
			await sys.sleep( argv.existsFlag( 'force' ) )
		else if ( argv.existsCmd( CMD.SLEEP ) ) {

			const toggle  = argv.existsFlag( 'toggle' )
			const enable  = argv.existsFlag( 'enable' )
			const disable = argv.existsFlag( 'disable' )
			const status  = await sys.getSleepStatus()

			const res =  !( toggle || enable || disable )
				? status
				: await sys.sleepMode(
					toggle
						? !status
						: enable ? true : disable ? false : status,
				)

			// console.log( {
			// 	toggle,
			// 	enable,
			// 	disable,
			// 	res,
			// 	status,
			// } )
			console.log( infoStyle( [ 'Sleep Mode Status', res ? 'Enabled' : 'Disabled' ] ) )

		}
		else console.log( getHelp() )

	},
} )

export default cli
export { cli }
