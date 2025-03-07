import { cli as app }         from '@umac-js/app'
import { cli as appearance }  from '@umac-js/appearance'
import { cli as cache }       from '@umac-js/cache'
import { cli as desktop }     from '@umac-js/desktop'
import { cli as finder }      from '@umac-js/finder'
import { cli as interacting } from '@umac-js/interacting'
import { cli as open }        from '@umac-js/open'
import { cli as run }         from '@umac-js/run'
import { cli as spotlight }   from '@umac-js/spotlight'
import { cli as sys }         from '@umac-js/system'
import { cli as terminal }    from '@umac-js/terminal'
import { UmacCommand }        from '@umac-js/utils'
import { cli as workflow }    from '@umac-js/workflow'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'

export const CMD_ID = {
	OPEN        : 'open',
	APPEARANCE  : 'appearance',
	WORKFLOW    : 'workflow',
	FINDER      : 'finder',
	CACHE       : 'cache',
	DESKTOP     : 'desktop',
	SPOTLIGHT   : 'spotlight',
	TERMINAL    : 'terminal',
	SYSTEM      : 'system',
	INTERACTING : 'interacting',
	APPS        : 'app',
	RUN         : 'run',
} as const
type commandID = typeof CMD_ID[keyof typeof CMD_ID]

export const CMD_ALIAS = {
	[CMD_ID.WORKFLOW]    : 'wf',
	[CMD_ID.INTERACTING] : 'interact',
	[CMD_ID.DESKTOP]     : 'desk',
	[CMD_ID.TERMINAL]    : 'term',
	[CMD_ID.SYSTEM]      : 'sys',
} as const

const setCMD = ( id: commandID, cmd: UmacCommand ):{
	help : NonNullable<UmacCommand['helpOpts']['cmds']>[number]
	run  : ( args: string[] ) => Promise<void>
} => {

	const cmdAlias      = id in CMD_ALIAS ? CMD_ALIAS[id as keyof typeof CMD_ALIAS] : undefined
	const helpOpts      = cmd.helpOpts
	helpOpts.examples$0 = `${BIN_NAME} ${id}`
	helpOpts.title      = BIN_NAME

	const {
		title: _t, ...restHelpOpts
	} = helpOpts
	return {
		help : {
			// value : id,
			value : !cmdAlias ? id : `${id}, ${cmdAlias}`,
			...restHelpOpts,
		},
		run : async ( args: string[] ) => {

			if ( args.includes( id ) || ( cmdAlias && args.includes( cmdAlias ) ) ) await cmd.run( args.slice( 1 ) )

		},
	}

}

const CMDS = {
	open        : setCMD( CMD_ID.OPEN, open as unknown as UmacCommand ),
	appearance  : setCMD( CMD_ID.APPEARANCE, appearance as unknown as UmacCommand ),
	workflow    : setCMD( CMD_ID.WORKFLOW, workflow as unknown as UmacCommand ),
	finder      : setCMD( CMD_ID.FINDER, finder as unknown as UmacCommand ),
	cache       : setCMD( CMD_ID.CACHE, cache as unknown as UmacCommand ),
	desktop     : setCMD( CMD_ID.DESKTOP, desktop as unknown as UmacCommand ),
	spotlight   : setCMD( CMD_ID.SPOTLIGHT, spotlight as unknown as UmacCommand ),
	terminal    : setCMD( CMD_ID.TERMINAL, terminal as unknown as UmacCommand ),
	system      : setCMD( CMD_ID.SYSTEM, sys as unknown as UmacCommand ),
	interacting : setCMD( CMD_ID.INTERACTING, interacting as unknown as UmacCommand ),
	app         : setCMD( CMD_ID.APPS, app as unknown as UmacCommand ),
	run         : setCMD( CMD_ID.RUN, run as unknown as UmacCommand ),
} satisfies { [k in commandID]: unknown }

const umac = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds: Object.values( CMDS ).map( v => v.help ) },
	fn       : async ( { argv } ) => {

		for ( const cmd of Object.values( CMDS ) ) {

			await cmd.run( argv.args )

		}

	},
} )

export default umac
