import {
	infoStyle,
	liStyle,
	successStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Terminal } from './core'

export const CMD = {
	SHELL         : 'shell',
	OPEN          : 'open',
	SHELL_LIST    : 'list',
	SHELL_CHANGE  : 'change',
	SHELL_CURRENT : 'current',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : CMD.OPEN,
			desc  : 'Opem Temrinal app',
		},
		{
			value : CMD.SHELL,
			desc  : 'Shell functions',
			cmds  : [
				{
					value : CMD.SHELL_LIST,
					desc  : 'List all shells',
				},
				{
					value : CMD.SHELL_CHANGE,
					desc  : 'Change to another shell',
				},
				{
					value : CMD.SHELL_CURRENT,
					desc  : 'Set current shell',
				},
			],
		},
	] },
	fn : async ( {
		argv, getHelp,
	} ) => {

		const term = new Terminal()

		if ( argv.existsCmd( CMD.SHELL ) ) {

			if ( argv.existsCmd( CMD.SHELL_CHANGE ) ) {

				const shell = await term.changeShell()
				console.log( successStyle( [ 'Termnial shell', 'Changed to ' + shell ] ) )

			}
			else if ( argv.existsCmd( CMD.SHELL_CURRENT ) ) {

				const shell = await term.getCurrentShell()
				console.log( infoStyle( [ 'Termnial shell', shell ] ) )

			}
			else if (  argv.existsCmd( CMD.SHELL_LIST ) ) {

				const shells = await term.getShellList()
				console.log( infoStyle( [ 'Available shells:', '\n' ] ) )
				shells.forEach( v => console.log( liStyle( v ) ) )

			}
			else console.log( getHelp() )

		}
		else if ( argv.existsCmd( CMD.OPEN ) ) {

			await term.open()
			console.log( successStyle( [ 'Termnial app', 'Succesfully opened!' ] ) )

		}

	},
} )

export default cli
export { cli }
