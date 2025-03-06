import {
	exec,
	joinPath,
	PATH,
	promptSelect,
	readDir,
	removePathIfExist,
} from '@umac/utils'

export class Cache {

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async openDir() {

		return await this.#exec( `open ${PATH.CACHE_DIR}` )

	}

	async askForRemove() {

		const dir    = PATH.CACHE_DIR
		const paths  = ( await readDir( dir ) ).map( v => v.name )
		const select = await promptSelect( 'Select a cache type to remove:', [ 'All', ...paths ] )
		const path   = select === 'All' ? dir : joinPath( dir, select )

		await removePathIfExist( path )

		return path

	}

}

