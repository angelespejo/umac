import {
	bold,
	const2Flag,
	successStyle,
	UmacCommand,
} from '@umac/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import {
	APP_PATH,
	Open,
} from './core'

const browserOpts = Object.keys( APP_PATH ).map( key => const2Flag( key ) )

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
				desc       : 'The path to open. Defualts to the current directory',
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

		const path = argv.getPositionalAt( 0 )
		const ID   = browserOpts.filter( key => argv.existsFlag( key ) )?.[0]

		const open = new Open()
		await open.run( path, ID )

		console.log( successStyle( `Opened "${path || process.cwd()}" in ${bold( ID ? ID : ( path?.startsWith( 'http' ) ? 'Default Browser' : 'Finder' ) )}` ) )

	},
} )

export default cli

export {
	APP_PATH,
	Open,
	cli,
}
