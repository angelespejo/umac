import {
	helpStyle,
	bold,
	dim,
} from './style'

export const versionOut = ( v: string ) => `${bold( 'Version' )} ${dim( v )}`

export type HelpOptsCmd = {
	desc     : string
	helpURL? : string
	cmds?: ( {
		value       : string
		posicional? : boolean | string
	} & HelpOptsCmd )[]
	cmdsDesc? : string
	flags?: {
		value : string
		desc  : string
	}[]
	flagsDesc? : string
	examples?: {
		value : string
		desc  : string
	}[]

	/**
	 * Custom replace value for $0 in examples
	 * @default this.title
	 */
	examples$0? : string
}

export type HelpOpts = HelpOptsCmd & {
	title         : string
	flagsGeneral?: {
		value : string
		desc  : string
	}[]
	flagsGeneralDesc? : string
}

export const helpOut = ( opts: HelpOpts, cmdUsage?: string[] ) => {

	const {
		title: appTitle,
		desc,
		helpURL,
		cmds,
		cmdsDesc,
		flags,
		flagsDesc,
		flagsGeneral,
		flagsGeneralDesc,
		examples,
		examples$0,
	} = opts

	const line        = `\n\n`
	const padding     = '  '
	const formatTitle = ( label: string ) => `${line}${helpStyle.sectionTitle( label )}${line}`

	const formatValues = ( items: {
		value : string
		desc  : string
	}[] ) => {

		if ( !items.length ) return ''

		const maxLength = Math.max( ...items.map( ( { value } ) => value.length ) )

		return items
			.map( ( {
				value, desc,
			} ) => `${padding}${value.padEnd( maxLength + 4 )}${desc}` )
			.join( '\n' )

	}

	let output = `${helpStyle.title( appTitle )}${line}${desc}${line}${helpStyle.sectionTitle( 'Usage:' )} ${helpStyle.bin( appTitle )}`
	if ( cmdUsage ) output += cmdUsage.map( c => ` ${helpStyle.cmd( c )}` ).join( '' )
	if ( cmds?.length ) output += ` ${helpStyle.cmd( '<command>' )}`
	if ( flags?.length || flagsGeneral?.length ) output += ` ${helpStyle.flag( '[...flags]' )}`

	if ( cmds?.length ) {

		output += formatTitle( 'Commands:' )
		output += formatValues( cmds.map( ( {
			value, posicional, desc,
		} ) => ( {
			value : posicional
				? typeof posicional === 'string'
					? ( helpStyle.cmd( value ) + ' ' + helpStyle.cmdPositional( posicional ) )
					: ( helpStyle.cmdPositional( value ) )
				: helpStyle.cmd( value ),
			desc : helpStyle.desc( desc ),
		} ) ) )
		if ( cmdsDesc ) output += `${line}${padding}${helpStyle.desc( cmdsDesc )}`

	}

	if ( flags?.length ) {

		output += formatTitle( 'Flags:' )
		output += formatValues( flags.map( ( {
			value, desc,
		} ) => ( {
			value : helpStyle.flag( value ),
			desc  : helpStyle.desc( desc ),
		} ) ) )
		if ( flagsDesc ) output += `${line}${padding}${helpStyle.desc( flagsDesc )}`

	}

	if ( flagsGeneral?.length ) {

		output += formatTitle( 'General Flags:' )
		output += formatValues( flagsGeneral.map( ( {
			value, desc,
		} ) => ( {
			value : helpStyle.flag( value ),
			desc  : helpStyle.desc( desc ),
		} ) ) )
		if ( flagsGeneralDesc ) output += `${line}${padding}${helpStyle.desc( flagsGeneralDesc )}`

	}

	if ( examples?.length ) {

		output += formatTitle( 'Examples:' )
		output += formatValues( examples.map( ( {
			value, desc,
		} ) => ( {
			value : helpStyle.desc( value.replaceAll( '$0', examples$0 || appTitle ) ),
			desc  : helpStyle.example( desc ),
		} ) ) )

	}

	if ( helpURL ) {

		output += `${line}${helpStyle.sectionTitle( 'Info:' )} ${helpStyle.url( helpURL )}`

	}

	return output

}
