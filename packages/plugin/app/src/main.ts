import {
	indent,
	infoStyle,
	italic,
	liStyle,
	successStyle,
	UmacCommand,
	underline,
	warnStyle,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Apps } from './core'

export const CMD = {
	SEARCH    : 'search',
	INSTALL   : 'install',
	UNINSTALL : 'uninstall',
	UNDEV     : 'undev',
	CLOSE     : 'close',
	LIST      : 'list',
} as const
export const CMD_ALIAS = {
	SEARCH    : 's',
	INSTALL   : 'i',
	UNINSTALL : 'u',
} as const

export const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value      : `${CMD.INSTALL}, ${CMD_ALIAS.INSTALL}`,
			posicional : 'app',
			desc       : `Install apps`,
			examples   : [
				{
					value : '$0 app install appName1 appName2',
					desc  : 'install multiple apps',
				},
			],
		},
		{
			value      : `${CMD.UNINSTALL}, ${CMD_ALIAS.UNINSTALL}`,
			posicional : 'app',
			desc       : `Uninstall apps using brew`,
			examples   : [
				{
					value : '$0 app uninstall app1 app2',
					desc  : 'Uninstall multiple apps',
				},
			],
		},
		{
			value      : `${CMD.SEARCH}, ${CMD_ALIAS.SEARCH}`,
			posicional : 'query',
			desc       : `Search apps with ${italic( 'brew search' )}`,
		},
		{
			value      : CMD.CLOSE,
			posicional : 'pattern',
			desc       : `Close apps`,
			flags      : [
				{
					value : '--ask',
					desc  : 'Displays a message to the user to select the applications that should be closed',

				},
			],
			examples : [
				{
					value : '$0 app close app1 app2',
					desc  : 'Close specific apps',
				},
				{
					value : '$0 app close "*"',
					desc  : 'Force close all apps',
				},
				{
					value : '$0 app close "*Avast*"',
					desc  : 'Close all apps that contains avast name',
				},
			],
		},

		{
			value     : CMD.UNDEV,
			flagsDesc : 'If there are not flags, Show status of unidentified apps',
			desc      : `Manage unidentified apps`,
			flags     : [
				{
					value : '--toggle',
					desc  : 'Toggle status of unidentified apps',
				},
				{
					value : '--enable',
					desc  : 'Enable unidentified apps',
				},
				{
					value : '--disable',
					desc  : 'Disable unidentified apps',
				},
			],
		},
		{
			value    : 'list',
			desc     : 'List apps',
			examples : [
				{
					value : 'app dev list \'!Avast*\' \'!*.avast*\'',
					desc  : 'list alll apps less Avast apps',
				},
			],
		},
	] },
	fn : async ( {
		argv, getHelp,
	} ) => {

		const app = new Apps()

		if ( argv.existsCmd( CMD.CLOSE ) ) {

			const ask     = argv.existsFlag( 'ask' )
			const filters = argv.getCmdValues( CMD.CLOSE )

			if ( ask ) await app.askClose( async v => console.log( successStyle( [ 'Removed app', v ] ) ) )
			else if ( !filters ) console.warn( warnStyle( [ 'Must add a install value!\n\nExample:', '... close vlc' ] ) )
			else  {

				const res = await app.close( filters, async v => console.log( successStyle( [ 'Removed app', v ] ) ) )
				if ( !res ) console.log( warnStyle( [ 'Any app found with pattern:', filters.join( ', ' ) ] ) )

			}

		}
		else if ( argv.existsCmd( CMD.INSTALL ) || argv.existsCmd( CMD_ALIAS.INSTALL ) ) {

			const filters = argv.getCmdValues( CMD.INSTALL )

			if ( !filters ) console.warn( warnStyle( [ 'You must add an install value!\n\nExample:', '... install vlc' ] ) )
			else await app.install( filters )

		}
		else if ( argv.existsCmd( CMD.UNINSTALL ) || argv.existsCmd( CMD_ALIAS.UNINSTALL ) ) {

			const filters = argv.getCmdValues( CMD.UNINSTALL )

			if ( !filters ) console.warn( warnStyle( [ 'You must add an unistall value!\n\nExample:', '... uninstall vlc' ] ) )
			else await app.uninstall( filters )

		}
		else if ( argv.existsCmd( CMD.SEARCH ) || argv.existsCmd( CMD_ALIAS.SEARCH ) ) {

			const filters = argv.getCmdValues( CMD.SEARCH )
			if ( !filters ) console.warn( warnStyle( [ 'You must add an search query!\n\nExample:', '... search "Chrome"' ] ) )
			else console.log( await app.search( filters?.join( ' ' ) ) )

		}
		else if ( argv.existsCmd( CMD.LIST ) ) {

			const filters = argv.getCmdValues( CMD.LIST )

			console.log(  infoStyle( [ underline( 'Sytem apps' ), '\n' ] ) )
			const apps = await app.getAll( filters )
			for ( const a of apps ) {

				console.log( indent( liStyle( [ a.name, a.path ] ) ) )

			}

		}
		else if ( argv.existsCmd( CMD.UNDEV ) ) {

			const permission = argv.existsFlag( 'toggle' )
				? !app.getUndevPermissions()
				:  argv.existsFlag( 'enable' )
					? true
					: argv.existsFlag( 'disable' ) ? false : undefined
			if ( typeof permission !== 'undefined' ) {

				await app.settUndevPermissions( permission )

			}
			const status = await app.getUndevPermissions()
			console.log( infoStyle( [ 'Unidentified Apps status:', status ? 'Enabled' : 'Disabled' ] ) )

		}
		else console.log( getHelp() )

	},
} )

export default cli

