
import { Argv }        from './argv'
import {
	homepage,
	version as VERSION,
}   from './const'
import { getPlatform } from './os'
import {
	HelpOpts,
	HelpOptsCmd,
	helpOut,
	versionOut,
} from './print'
import { process } from './process'
import {
	dim,
	errorStyle,
} from './style'

export type UmacCommandFn = ( data: {
	argv    : Argv
	process : typeof process
	getHelp : () => string
} ) => Promise<void>

export type UmacCommandOpts = {
	name        : string
	description : string
	fn          : UmacCommandFn
	version?    : string
	helpURL?    : string
	helpOpts?   : Omit<HelpOpts, 'title' | 'desc' | 'helpURL'>
}

export const const2Flag = ( s:string ) => s.toLowerCase().replaceAll( '_', '-' )
export const flag2Const = ( s:string ) => s.toUpperCase().replaceAll( '-', '_' )

export class UmacCommand {

	version
	helpOpts : HelpOpts
	#fn

	constructor(
		{
			fn, name, description, helpURL, version, helpOpts,
		}: UmacCommandOpts,
	) {

		this.version  = version || VERSION
		this.#fn      = fn
		this.helpOpts = {
			title        : name,
			desc         : description,
			flagsGeneral : [
				{
					value : '-h, --help',
					desc  : 'Display this help message',
				},
				{
					value : '-v, --version',
					desc  : 'Display the current version',
				},
				{
					value : '--debug',
					desc  : 'Display debug information',
				},
			],
			helpURL : helpURL || homepage,
			...helpOpts,
		}

	}

	#setHelp( cmds: string[] | undefined ) {

		if ( !cmds || !cmds.length ) return helpOut( this.helpOpts )

		const getCmdHelpOpts = ( helpOpts: HelpOpts | HelpOptsCmd, cmdValue: string ): HelpOptsCmd | undefined => {

			if ( !helpOpts.cmds ) return undefined
			return helpOpts.cmds.find( v => v.value.split( ',' ).map( d => d.trim() ).includes( cmdValue ) )

		}

		let isFirst                = true,
			currentHelpOpts: HelpOptsCmd = this.helpOpts
		const currentCmd: string[] = []
		for ( const cmd of cmds ) {

			const nextHelpOpts = getCmdHelpOpts( currentHelpOpts, cmd )
			if ( !nextHelpOpts ) break
			currentHelpOpts = nextHelpOpts
			currentCmd.push( cmd )
			isFirst = false

		}
		const {
			desc, ...rest
		} = currentHelpOpts

		return helpOut( {
			desc             : isFirst ? desc : this.helpOpts.desc + ': ' + dim( currentHelpOpts.desc ),
			title            : this.helpOpts.title,
			flagsGeneral     : this.helpOpts.flagsGeneral,
			flagsGeneralDesc : this.helpOpts.flagsGeneralDesc,
			...rest,
		}, currentCmd.length ? currentCmd : undefined )

	}

	async run( args: string[] = process.argv.slice( 2 ) ): Promise<void> {

		try {

			const argv  = new Argv( args )
			const plat  = await getPlatform()
			const debug = argv.existsFlag( 'debug' )
			if ( !debug ) console.debug = () => {}

			console.debug( {
				args : argv.args,
				plat,
			} )

			const getHelp = () =>  this.#setHelp( argv.getCmds() )

			if ( !argv.args || !argv.args.length || argv.existsFlag( 'help' ) || argv.existsFlag( 'h' ) )
				return console.log( getHelp() )
			if ( argv.existsFlag( 'version' ) || argv.existsFlag( 'v' ) )
				return console.log( versionOut( this.version ) )
			else await this.#fn( {
				argv,
				process,
				getHelp,
			} )

		}
		catch ( error ) {

			if ( error instanceof Error )
				console.error( errorStyle( error.message ) )
			else console.error( error )

		}

	}

}
