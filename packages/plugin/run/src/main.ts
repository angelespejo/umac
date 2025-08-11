import {
	UmacCommand,
	warnStyle,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Run } from './core'

const flags =  [
	{
		value : '--input, -i',
		desc  : 'Set input (path, text or URL)',
	},
]
export const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value : 'jxa',
				desc  : 'Run jxa file script',
				flags,
			},
			{
				value : 'node, js, ts',
				desc  : 'Run js|ts file script',
				flags,
			},
			{
				value : 'osascript',
				desc  : 'Run osascript file script',
				flags,
			},
			{
				value : 'python',
				desc  : 'Run python file script',
				flags,
			},
			{
				value : 'bash',
				desc  : 'Run bash file script',
				flags,
			},

		],
		flags,
		examples : [
			{
				value : '$0 bash -i "echo hola"',
				desc  : 'bash',
			},
			{
				value : '$0 jxa -i \'Application("System Events").currentUser().name()\'',
				desc  : 'jxa',
			},
			{
				value : '$0 js -i \'console.log("hello!")\'',
				desc  : 'js',
			},
		],
	},
	fn : async ( {
		argv, getHelp,
	} ) => {

		const code = argv.getFlagValue( 'input' ) || argv.getFlagValue( 'i' )

		const run = new Run()
		if ( !code ) console.log( warnStyle( 'need --input|-i [value] flag with a local route' ) )
		else if ( argv.existsCmd( 'node' ) || argv.existsCmd( 'js' ) || argv.existsCmd( 'ts' ) )
			await run.node( code )
		else if ( argv.existsCmd( 'bash' ) )
			await run.bash( code )
		else if ( argv.existsCmd( 'jxa' ) )
			await run.jxa( code )
		else if ( argv.existsCmd( 'osascript' ) )
			await run.osascript( code )
		else if ( argv.existsCmd( 'python' ) )
			await run.python( code )
		else getHelp()

	},
} )

export default cli

