import { UmacCommand } from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import {
	cliReboot,
	cliShutdown,
	cliUpdate,
	cliVersion,
	CMD as CoreCMD,
} from './core/core.cli'
import { cliInfo }  from './core/info.cli'
import { cliPower } from './core/power.cli'
import {
	cliSleep,
	cliSleepNow,
} from './core/sleep.cli'
import { cliTemperature } from './core/temperature.cli'

export * from './core'

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			cliReboot.cmd,
			cliShutdown.cmd,
			cliUpdate.cmd,
			cliVersion.cmd,
			cliSleepNow.cmd,
			cliSleep.cmd,
			cliInfo.cmd,
			cliPower.cmd,
			cliTemperature.cmd,
		],
	},
	fn : async data => {

		const {
			argv, getHelp,
		} = data

		if ( CoreCMD.REBOOT.some( v => argv.existsCmd( v ) ) )
			await cliReboot.fn( data )
		else if ( CoreCMD.SHUTDOWN.some( v => argv.existsCmd( v ) ) )
			await cliShutdown.fn( data )
		else if ( CoreCMD.UPDATE.some( v => argv.existsCmd( v ) ) )
			await cliUpdate.fn( data )
		else if ( CoreCMD.VERSION.some( v => argv.existsCmd( v ) ) )
			await cliVersion.fn( data )
		else if ( argv.existsCmd( cliSleepNow.cmd.value ) )
			await cliSleepNow.fn( data )
		else if ( argv.existsCmd( cliSleep.cmd.value ) )
			await cliSleep.fn( data )
		else if ( argv.existsCmd( cliInfo.cmd.value ) )
			await cliInfo.fn( data )
		else if ( argv.existsCmd( cliPower.cmd.value ) )
			await cliPower.fn( data )
		else if ( argv.existsCmd( cliTemperature.cmd.value ) )
			await cliTemperature.fn( data )
		else console.log( getHelp() )

	},
} )

export default cli
export {
	cli,
}
