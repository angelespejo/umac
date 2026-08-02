import {
	errorStyle,
	infoStyle,
	liStyle,
	successStyle,
	UmacCommand,
	underline,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Shortcuts } from './core'

export const CMD = {
	OPEN : 'open',
	LIST : 'list',
	RUN  : 'run',
	VIEW : 'view',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value    : CMD.OPEN,
				desc     : 'Open the Shortcuts app',
				examples : [
					{
						desc  : 'Open Shortcuts app',
						value : '$0 open',
					},
				],
			},
			{
				value : CMD.LIST,
				desc  : 'List shortcuts or folders',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
					{
						value : '-f, --folder <name>',
						desc  : 'List shortcuts of a folder (use "none" for unfiled)',
					},
					{
						value : '--folders',
						desc  : 'List folders instead of shortcuts',
					},
					{
						value : '-i, --identifiers',
						desc  : 'Show identifiers with each shortcut',
					},
				],
				examples : [
					{
						desc  : 'List all shortcuts',
						value : '$0 list',
					},
					{
						desc  : 'List shortcuts of a folder',
						value : '$0 list --folder "My Folder"',
					},
					{
						desc  : 'List folders',
						value : '$0 list --folders',
					},
					{
						desc  : 'List shortcuts with identifiers as JSON',
						value : '$0 list --identifiers --res=json',
					},
				],
			},
			{
				value : CMD.RUN,
				desc  : 'Run a shortcut',
				flags : [
					{
						value : '-i, --input <path>',
						desc  : 'Input to provide to the shortcut',
					},
					{
						value : '-o, --output <path>',
						desc  : 'Where to write the shortcut output',
					},
					{
						value : '--output-type <uti>',
						desc  : 'Output data type in Universal Type Identifier format',
					},
				],
				examples : [
					{
						desc  : 'Run a shortcut',
						value : '$0 run "My Shortcut"',
					},
					{
						desc  : 'Run a shortcut with input and output',
						value : '$0 run "Resize Image" -i "photo.jpg" -o "resized.jpg"',
					},
				],
			},
			{
				value    : CMD.VIEW,
				desc     : 'View a shortcut in the Shortcuts app',
				examples : [
					{
						desc  : 'View a shortcut',
						value : '$0 view "My Shortcut"',
					},
				],
			},
		],
	},
	fn : async ( { argv } ) => {

		const shortcuts = new Shortcuts()

		// 1. OPEN
		if ( argv.existsCmd( CMD.OPEN ) ) {

			await shortcuts.open()
			console.log( successStyle( `Shortcuts app opened successfully` ) )

		}
		// 2. LIST
		else if ( argv.existsCmd( CMD.LIST ) ) {

			const format      = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'
			const folder      = argv.getFlagValue( 'folder' ) || argv.getFlagValue( 'f' )
			const folders     = argv.existsFlag( 'folders' )
			const identifiers = argv.existsFlag( 'identifiers' ) || argv.existsFlag( 'i' )

			const result = await shortcuts.list( {
				folder,
				folders,
				identifiers,
			} )

			if ( format === 'json' ) {

				console.log( JSON.stringify( result ) )

			}
			else {

				console.log( infoStyle( [ 'Total:', `${result.length}` ] ) )
				if ( result.length === 0 ) return
				console.log( `\n${underline( folders ? 'Folders' : 'Shortcuts' )}\n` )
				result.forEach( item => {

					const text = typeof item === 'string' ? item : item.id ? `${item.name} (${item.id})` : item.name
					console.log( liStyle( text ) )

				} )

			}

		}
		// 3. RUN
		else if ( argv.existsCmd( CMD.RUN ) ) {

			const name = ( argv.getCmdValues( CMD.RUN ) || [] )[0]
			if ( !name ) {

				console.log( errorStyle( `Please specify a shortcut name. Example: shortcuts run "My Shortcut"` ) )
				return

			}

			const output = await shortcuts.run( name, {
				input      : argv.getFlagValue( 'input' ) || argv.getFlagValue( 'i' ),
				output     : argv.getFlagValue( 'output' ) || argv.getFlagValue( 'o' ),
				outputType : argv.getFlagValue( 'output-type' ),
			} )

			if ( output && output !== shortcuts.CODE.SUCCESS ) console.log( output )
			console.log( successStyle( `Shortcut "${name}" executed successfully` ) )

		}
		// 4. VIEW
		else if ( argv.existsCmd( CMD.VIEW ) ) {

			const name = ( argv.getCmdValues( CMD.VIEW ) || [] )[0]
			if ( !name ) {

				console.log( errorStyle( `Please specify a shortcut name. Example: shortcuts view "My Shortcut"` ) )
				return

			}

			await shortcuts.view( name )
			console.log( successStyle( `Shortcut "${name}" opened in the Shortcuts app` ) )

		}

	},
} )

export default cli
export {
	cli,
	Shortcuts,
}
