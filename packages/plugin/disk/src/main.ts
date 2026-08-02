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
import { Disk } from './core'

export const CMD = {
	LIST  : 'list',
	SPACE : 'space',
	INFO  : 'info',
	EJECT : 'eject',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value : CMD.LIST,
				desc  : 'List disks and their partitions',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
				],
				examples : [
					{
						value : '$0 list',
						desc  : 'List all disks',
					},
					{
						value : '$0 list --res=json',
						desc  : 'List all disks as JSON',
					},
				],
			},
			{
				value : CMD.SPACE,
				desc  : 'Show disk space usage',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
				],
				examples : [
					{
						value : '$0 space',
						desc  : 'Show space usage of mounted volumes',
					},
					{
						value : '$0 space --res=json',
						desc  : 'Show space usage as JSON',
					},
				],
			},
			{
				value    : CMD.INFO,
				desc     : 'Show detailed info about a disk or volume',
				examples : [
					{
						value : '$0 info /dev/disk0',
						desc  : 'Show info of the root volume',
					},
				],
			},
			{
				value    : CMD.EJECT,
				desc     : 'Eject a disk or volume',
				examples : [
					{
						value : '$0 eject disk3s1',
						desc  : 'Eject the volume disk3s1',
					},
				],
			},
		],
	},
	fn : async ( { argv } ) => {

		const disk   = new Disk()
		const format = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'

		// 1. LIST
		if ( argv.existsCmd( CMD.LIST ) ) {

			try {

				const result = await disk.list()

				if ( format === 'json' ) {

					console.log( JSON.stringify( result, null, 2 ) )
					return

				}

				if ( result.length === 0 ) return

				result.forEach( entry => {

					console.log( `\n${underline( `${entry.device} (${entry.kind})` )}` )
					entry.partitions.forEach( part => {

						const name = part.name ? ` ${part.name}` : ''
						console.log( liStyle( `${part.type}${name} — ${part.size} (${part.identifier})` ) )

					} )

				} )

			}
			catch ( e ) {

				console.log( errorStyle( ( e as Error ).message ) )

			}

		}
		// 2. SPACE
		else if ( argv.existsCmd( CMD.SPACE ) ) {

			try {

				const result = await disk.space()

				if ( format === 'json' ) {

					console.log( JSON.stringify( result, null, 2 ) )
					return

				}

				if ( result.length === 0 ) return

				console.log( underline( 'Filesystem  Size  Used  Avail  Capacity  Mounted on' ) )
				result.forEach( row => console.log( infoStyle( `${row.filesystem}  ${row.size}  ${row.used}  ${row.avail}  ${row.capacity}  ${row.mount}` ) ) )

			}
			catch ( e ) {

				console.log( errorStyle( ( e as Error ).message ) )

			}

		}
		// 3. INFO
		else if ( argv.existsCmd( CMD.INFO ) ) {

			const volume = ( argv.getCmdValues( CMD.INFO ) || [] )[0]
			if ( !volume ) {

				console.log( errorStyle( `Please specify a disk or volume. Example: disk info "/dev/disk0"` ) )
				return

			}

			try {

				const output = await disk.info( volume )
				console.log( output )

			}
			catch ( e ) {

				console.log( errorStyle( ( e as Error ).message ) )

			}

		}
		// 4. EJECT
		else if ( argv.existsCmd( CMD.EJECT ) ) {

			const volume = ( argv.getCmdValues( CMD.EJECT ) || [] )[0]
			if ( !volume ) {

				console.log( errorStyle( `Please specify a disk or volume. Example: disk eject disk3s1` ) )
				return

			}

			try {

				const output = await disk.eject( volume )
				console.log( output )
				console.log( successStyle( `"${volume}" ejected successfully` ) )

			}
			catch ( e ) {

				console.log( errorStyle( ( e as Error ).message ) )

			}

		}

	},
} )

export default cli
export {
	cli,
	Disk,
}
