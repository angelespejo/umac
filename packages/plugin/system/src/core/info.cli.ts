import { CliCore } from './_shared'
import { Info }    from './info'

const info =  new Info()

export const cliInfo: CliCore = {
	cmd : {
		value : 'info',
		desc  : 'Show info about system',
		cmds  : [
			{
				value : 'list',
				desc  : 'List all info types',
			},
			{
				value : 'view',
				desc  : 'View system info',
				flags : [
					{
						value : 'type',
						desc  : 'Type of info',
					},
					{
						value : 'format',
						desc  : 'format of info. Available: json, raw. Default: raw',
					},
				],
				examples : [
					{
						value : '$0 info view --type USB -f json',
						desc  : 'View USB info in json format',
					},
				],
			},
		],
		flags : [
			{
				value : 'list',
				desc  : 'List all info',

			},
		],
	},
	fn : async ( {
		argv, getHelp,
	} ) => {

		if ( argv.existsCmd( 'list' ) ) {

			const list = await info.list( )
			console.log( list.join( '\n' ) )

		}
		else if ( argv.existsCmd( 'view' ) ) {

			const type = argv.getFlagValue( 'type' )
			const res  = await info.get(
				type ? [ type ] : [],
				argv.getFlagValue( 'format' ) === 'json' ? 'json' : 'raw',
			)
			console.log( res )

		}
		else console.log( await getHelp( ) )

	},
}
