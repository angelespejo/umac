import {
	infoStyle,
	successStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Finder } from './core'

export const CMD = {
	RELOAD   : 'reload',
	DOTFILES : 'dotfiles',
	CLOSE    : 'close',
} as const
const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : CMD.CLOSE,
			desc  : 'Close all Finder windows and force exit from Finder',
		},
		{
			value : CMD.RELOAD,
			desc  : 'Reload Finder',
		},
		{
			value : CMD.DOTFILES,
			desc  : 'Show hide or toggle dotfiles visibility',
			flags : [
				{
					value : '--toggle',
					desc  : 'Toggle dotfile visibility',
				},
				{
					value : '--enable',
					desc  : 'Enable dotfile visibility',
				},
				{
					value : '--disable',
					desc  : 'Disable dotfile visibility',
				},
			],
		},
	] },
	fn : async ( { argv } ) => {

		const finder = new Finder()

		if ( argv.existsCmd( CMD.CLOSE ) ) {

			await finder.close()
			console.log( successStyle( `Finder was closed successfully` ) )

		}
		else if ( argv.existsCmd( CMD.RELOAD ) ) {

			await finder.reload()
			console.log( successStyle( `Finder was reloaded successfully` ) )

		}
		else if ( argv.existsCmd( CMD.DOTFILES ) ) {

			const flag = argv.existsFlag( 'disable' )
				? false
				: argv.existsFlag( 'enable' )
					? true
					: argv.existsFlag( 'toggle' )
						? 'toggle'
						: 'status'

			const status = ( flag === 'status' )
				? await finder.files.isShowingAll()
				: await finder.files.showAll( flag )
			console.log( infoStyle( [ 'Dot files:', status ? 'enabled' : 'disable' ] ) )

		}

	},
} )

export default cli
export {
	cli,
	Finder,
}
