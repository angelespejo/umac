import {
	exec,
	formatBytes,
	getPathsData,
	joinPath,
	PATH,
	promptSelect,
	removePathIfExist,
} from '@umac-js/utils'

export class Cache {

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr && stderr.toString().trim() !== '' ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	/**
	 * Opens the cache directory in the default file manager application.
	 * The cache directory is located at `~/Library/Caches`.
	 *
	 * @returns {Promise<string>} - A promise that resolves to the stdout of the executed command.
	 */
	async openDir() {

		return await this.#exec( `open ${PATH.CACHE_DIR}` )

	}

	/**
	 * Ask the user to select a cache type to remove from the cache directory.
	 * If the user selects 'All', the cache directory will be removed.
	 * If the user selects a specific cache type, that cache type will be removed.
	 *
	 * @returns {string} The path of the cache type that was removed.
	 */
	async askForRemove(): Promise<string> {

		const dir       = PATH.CACHE_DIR
		const pathsData = await getPathsData( dir )

		// Calculate total size for 'All'
		const totalSize = pathsData.reduce( ( acc, item ) => acc + item.size, 0 )

		// Sort paths by size in descending order (largest first)
		const sortedPaths = pathsData.sort( ( a, b ) => b.size - a.size )

		const paths = sortedPaths.map( v => ( {
			value : v.name,
			desc  : `(${formatBytes( v.size )})`,
		} ) )

		const allOption = {
			value : 'All',
			desc  : `(${formatBytes( totalSize )})`,
		}

		const select = await promptSelect( 'Select a cache type to remove:', [ allOption, ...paths ] )
		const path   = select === 'All' ? dir : joinPath( dir, select )

		await removePathIfExist( path )

		return path

	}

	/**
	 * Clears the system DNS cache on macOS.
	 *
	 * This method executes the following shell command:
	 * `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
	 *
	 * Breakdown:
	 * - `dscacheutil -flushcache`: Flushes the directory service cache, including
	 * legacy DNS entries on older versions of macOS.
	 * - `sudo killall -HUP mDNSResponder`: Restarts the mDNSResponder daemon,
	 * which is responsible for DNS resolution on macOS, effectively clearing the DNS cache.
	 *
	 * Useful for resolving DNS-related issues, such as when a domain's IP has changed
	 * and the system is still using a cached version.
	 *
	 * @returns {Promise<void>} A promise that resolves when the DNS cache has been cleared.
	 */
	async removeSystemCache() {

		await this.#exec( `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` )

	}

}

