import {
	bold,
	const2Flag,
	flag2Const,
	isDirectory,
	successStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import {
	Open, APP_PATH,
} from './core'

const browserOpts = [ ...Object.keys( APP_PATH ).map( key => const2Flag( key ) ), 'browser-default' ]

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
				desc       : 'The path to open. Defaults to the current directory',
			},
		],
		flagsDesc : `if no flags are provided, the default path will be opened in ${bold( 'Finder' )}`,
		flags     : browserOpts.map( key => ( {
			value : `--${key}`,
			desc  : `Open Path in ${bold( key )}`,
		} ) ),
		examples : [
			{
				value : `$0 /path/to/file`,
				desc  : 'Open the file in Finder',
			},
			{
				value : `$0 /path/to/file --chrome`,
				desc  : 'Open the file in Chrome',
			},
			{
				value : `$0 ./package.json --text-edit`,
				desc  : 'Open the file in TextEdit App',
			},
		],
	},
	fn : async ( {
		argv, process,
	} ) => {

		const path           = argv.getPositionalAt( 0 ) || process.cwd()
		const idFlag         = browserOpts.find( key => argv.existsFlag( key ) )
		const ID             = idFlag ? flag2Const( idFlag ) : undefined
		const browserDefault =  ID === 'BROWSER_DEFAULT'

		const open = new Open()

		const appOption = ID && browserDefault
			? { type: 'browser-default' as const }
			: ID
				? {
					value : ID,
					type  : 'app' as const,
				}
				: undefined

		await open.run( path, appOption )
		const isDir = await isDirectory( path )

		const targetName = ID && browserDefault
			? 'Browser default'
			: ID
				? ( isDir ? 'Finder' : 'Xcode' )
				: 'Finder'

		console.log( successStyle( `Opened "${path}" in ${bold( targetName )}` ) )

	},
} )

export default cli

export {
	APP_PATH,
	Open,
	cli,
}
