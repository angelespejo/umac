import {
	indent,
	liStyle,
	UmacCommand,
	underline,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import {
	WORKFLOW_DESCRIPTIONS,
	WORKFLOW_CMD,
	Workflow,
} from './core'

const cmds = Object.values( WORKFLOW_CMD )

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : cmds.map( value => ( {
		value,
		desc  : WORKFLOW_DESCRIPTIONS[value],
		flags : value === WORKFLOW_CMD.COPY
			? [
				{
					value : '--output, -o',
					desc  : 'Output to copy workflows directory',
				},
			]
			: undefined,
	} ) ) },
	fn : async ( { argv } ) => {

		const wf = new Workflow(  )

		if ( argv.existsCmd( WORKFLOW_CMD.LIST ) ) {

			const list = await wf.list()
			console.log( underline(  'Available Workflows' ), '\n' )
			list.forEach( item => console.log( indent( liStyle( item ) ) ) )

		}
		else if ( argv.existsCmd( WORKFLOW_CMD.COPY ) ) {

			await wf.copy( argv.getFlagValue( 'output' ) || argv.getFlagValue( 'o' ) )

		}
		else if ( argv.existsCmd( WORKFLOW_CMD.OPEN_DIR ) ) {

			await wf.openDir()

		}
		else if ( argv.existsCmd( WORKFLOW_CMD.OPEN ) ) {

			await wf.open()

		}
		else if ( argv.existsCmd( WORKFLOW_CMD.NEW ) ) {

			await wf.new()

		}

	},
} )

export default cli
export {
	cli,
	WORKFLOW_CMD,
	Workflow,
}
