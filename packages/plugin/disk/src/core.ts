/* eslint-disable jsdoc/require-returns */
import { spawn } from 'node:child_process'

class DiskSuper {

	protected async _exec( cmd: string ) {

		return new Promise<string>( ( resolve, reject ) => {

			const child = spawn( '/bin/sh', [ '-c', cmd ], {
				stdio : [
					'ignore',
					'pipe',
					'pipe',
				],
			} )

			let stdout = '',
				stderr = ''

			child.stdout.on( 'data', data => {

				stdout += data.toString()

			} )
			child.stderr.on( 'data', data => {

				stderr += data.toString()

			} )

			child.on( 'error', reject )
			child.on( 'close', code => {

				if ( code === 0 ) resolve( stdout.trim() )
				else reject( new Error( stderr.trim() || `Command exited with code ${code}` ) )

			} )

		} )

	}

	protected _escape( value: string ) {

		return value
			.replace( /\\/g, '\\\\' )
			.replace( /"/g, '\\"' )

	}

}

export type DiskSpace = {
	filesystem : string
	size       : string
	used       : string
	avail      : string
	capacity   : string
	mount      : string
}

export type DiskPartition = {
	index      : number
	type       : string
	name       : string
	size       : string
	identifier : string
}

export type DiskEntry = {
	device     : string
	kind       : string
	partitions : DiskPartition[]
}

export class Disk extends DiskSuper {

	CODE = {
		SUCCESS           : 'success',
		ERROR_NONE_PARAMS : 'error-none-params',
		ERROR_NOT_MACOS   : 'error-not-macos',
	} as const

	/**
	 * Lists the disk space usage of mounted volumes.
	 *
	 * @example
	 * ```typescript
	 * const spaces = await disk.space()
	 * console.log( spaces[0] ) // { filesystem: '/dev/disk3s1s1', size: '228Gi', ... }
	 * ```
	 */
	async space(): Promise<DiskSpace[]> {

		const raw   = await this._exec( 'df -h' )
		const lines = raw.split( '\n' ).slice( 1 )

		return lines
			.map( line => line.match( /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+\S+\s+(.+)$/ ) )
			.filter( ( match ): match is RegExpMatchArray => !!match )
			.map( match => ( {
				filesystem : match[1],
				size       : match[2],
				used       : match[3],
				avail      : match[4],
				capacity   : match[5],
				mount      : match[6].trim(),
			} ) )

	}

	/**
	 * Lists the disks and their partitions.
	 *
	 * @example
	 * ```typescript
	 * const disks = await disk.list()
	 * console.log( disks[0] ) // { device: '/dev/disk0', kind: 'internal, physical', partitions: [...] }
	 * ```
	 */
	async list(): Promise<DiskEntry[]> {

		const raw = await this._exec( 'diskutil list' )

		const res : DiskEntry[]        = []
		let current : DiskEntry | null = null

		for ( const line of raw.split( '\n' ) ) {

			const deviceMatch = line.match( /^(\/dev\/\S+)\s+\((.*)\):$/ )
			if ( deviceMatch ) {

				current = {
					device     : deviceMatch[1],
					kind       : deviceMatch[2].trim(),
					partitions : [],
				}
				res.push( current )
				continue

			}

			if ( !current ) continue

			const partMatch = line.match( /^\s+(\d+):\s+(.+?)\s{2,}([*+]?\d[\d.,]*\s?[A-Za-z]*)\s+(\S+)$/ )
			if ( partMatch ) {

				const typeName = partMatch[2].trim().split( /\s+/ )
				current.partitions.push( {
					index      : Number( partMatch[1] ),
					type       : typeName.shift() || '',
					name       : typeName.join( ' ' ),
					size       : partMatch[3].trim(),
					identifier : partMatch[4],
				} )

			}

		}

		return res

	}

	/**
	 * Shows detailed info about a disk or volume.
	 *
	 * @param {string} volume - The disk or volume name, identifier or mount point.
	 * @example
	 * ```typescript
	 * const info = await disk.info( '/' )
	 * ```
	 */
	async info( volume: string ) {

		if ( !volume ) return this.CODE.ERROR_NONE_PARAMS

		const raw = await this._exec( `diskutil info "${this._escape( volume )}"` )
		return raw || this.CODE.SUCCESS

	}

	/**
	 * Ejects a disk or volume.
	 *
	 * @param {string} volume - The disk or volume name, identifier or mount point.
	 * @example
	 * ```typescript
	 * const res = await disk.eject( 'disk3s1' )
	 * ```
	 */
	async eject( volume: string ) {

		if ( !volume ) return this.CODE.ERROR_NONE_PARAMS

		const raw = await this._exec( `diskutil eject "${this._escape( volume )}"` )
		return raw || this.CODE.SUCCESS

	}

}
