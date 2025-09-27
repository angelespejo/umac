import { infoStyle } from '@umac-js/utils'

import { CliCore } from './_shared'
import { Core }    from './core'

export * from './core'

export const CMD = {
	REBOOT   : [ 'reboot' ],
	SHUTDOWN : [ 'shutdown', 'down' ],
	UPDATE   : [ 'update', 'up' ],
	VERSION  : [ 'version' ],
} as const

const sys = new Core()

export const cliUpdate: CliCore = {
	cmd : {
		desc  : 'System updates',
		value : CMD.UPDATE.join( ', ' ),
		flags : [
			{
				value : '--install, -i',
				desc  : 'Install System updates',
			},
			{
				value : '--history',
				desc  : 'Get system updates history',
			},
		],
	},
	fn : async ( { argv } ) => {

		const install = argv.existsFlag( 'install' ) || argv.existsFlag( 'i' )
		const history = argv.existsFlag( 'history' ) || argv.existsFlag( 'h' )

		if ( history ) return console.log( await sys.getUpdateHistory( ) )
		console.log( install ? await sys.update() : await sys.getUpdate( ) )

	},
}
export const cliShutdown: CliCore = {
	cmd : {
		desc  : 'Close down the system at a given time',
		value : CMD.SHUTDOWN.join( ', ' ),
	},

	fn : async () => {

		await sys.shutdown()

	},
}

export const cliReboot: CliCore = {
	cmd : {
		desc  : 'Reboot system',
		value : CMD.REBOOT.join( ', ' ),
	},
	fn : async () => {

		await sys.reboot()

	},
}

export const cliVersion: CliCore = {
	cmd : {
		desc  : 'Show system version',
		value : CMD.VERSION.join( ', ' ),
	},
	fn : async () => {

		console.log( infoStyle( [ 'System Version\n', '\n' + ( await sys.getVersion() ) ] ) )

	},
}

