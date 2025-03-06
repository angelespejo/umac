import {
	bold,
	color,
	infoStyle,
	UmacCommand,
	underline,
} from '@umac/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import {
	COLOR_ID,
	ColorId,
} from './core/color'
import { Appearance } from './core/main'

export { Appearance }
const {
	MULTIPLE: _, ...COLOR_ACCEPTED
} = COLOR_ID
const COLORS    = Object.values( COLOR_ACCEPTED )
const flagColor = [
	...( COLORS.map( d => ( {
		value : `--${d}`,
		desc  : `Set color to ${bold( d )}`,
	} ) ) ),
	{
		value : '--reload, -r',
		desc  : 'Reload Finder after command. Useful if changes are not displayed. Default: false',
	},
]

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : 'dark-mode',
			desc  : 'Dark mode utilities. toggle, set, get...',
			flags : [
				{
					value : '--toggle',
					desc  : 'Toggle dark mode',
				},
				{
					value : '--enable',
					desc  : 'Enable dark mode',
				},
				{
					value : '--disable',
					desc  : 'Disable dark mode',
				},
			],
		},
		{
			value : 'color',
			desc  : 'Color utilities. Like accent, highlight...',
			cmds  : [
				{
					value : 'accent',
					desc  : 'Accent color utils',
					flags : flagColor,
				},
				{
					value : 'highlight',
					desc  : 'Highlight color utils',
					flags : flagColor,
				},
			],
			flags : flagColor,
		},
	] },
	fn : async ( { argv } ) => {

		const theme = new Appearance(  )

		if ( argv.existsCmd( 'dark-mode' ) ) {

			const toggle  = argv.existsFlag( 'toggle' )
			const enable  = argv.existsFlag( 'enable' )
			const disable = argv.existsFlag( 'disable' )

			if ( toggle ) await theme.darkmode.toggle()
			else if ( enable ) await theme.darkmode.enable()
			else if ( disable ) await theme.darkmode.disable()

			const status = await theme.darkmode.getStatus()

			console.log( infoStyle( [ `Dark Mode:`, `${status ? underline( 'enabled' ) : underline( 'disabled' )}` ] ) )

		}
		else if ( argv.existsCmd( 'color' ) ) {

			const accent                                              = await theme.color.getAccent()
			const highlight                                           = await theme.color.getHighlight()
			const coloredFn: Record<ColorId, ( v: string ) => string> = {
				[theme.color.COLOR_ID.RED]      : color.red,
				[theme.color.COLOR_ID.ORANGE]   : color.redBright,
				[theme.color.COLOR_ID.YELLOW]   : color.yellow,
				[theme.color.COLOR_ID.GREEN]    : color.green,
				[theme.color.COLOR_ID.BLUE]     : color.blue,
				[theme.color.COLOR_ID.PURPLE]   : color.magenta,
				[theme.color.COLOR_ID.PINK]     : color.magentaBright,
				[theme.color.COLOR_ID.GRAY]     : color.gray,
				[theme.color.COLOR_ID.MULTIPLE] : color.white, // O algún color por defecto
			} as const
			const colored                                             = ( v:ColorId ) => coloredFn[v]( v )

			const flagColor = COLORS.filter( key => argv.existsFlag( key ) )?.[0]
			if ( argv.existsCmd( 'accent' ) ) await theme.color.setAccentColor( flagColor )
			else if ( argv.existsCmd( 'highlight' ) ) await theme.color.setHighlightColor( flagColor )

			if ( argv.existsFlag( 'reload' ) || argv.existsFlag( 'r' ) ) await theme.reloadFinder()

			console.log( infoStyle( [ `Color Accent:`, colored( accent ) ] ) )
			console.log( infoStyle( [ `Color Highlight:`,  colored( highlight ) ] ) )

		}

	},
} )

export default cli
export { cli }
