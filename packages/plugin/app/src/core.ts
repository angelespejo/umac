import {
	exec,
	getBaseName,
	getMatch,
	PATH,
	promptMultipleSelect,
} from '@umac/utils'

export class Brew {

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async exists(): Promise<boolean> {

		try {

			const result = await this.#exec( 'which brew' )
			return result !== ''

		}
		catch ( _e ) {

			return false

		}

	}

	async install() {

		const installCommand = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
		return await this.#exec( installCommand )

	}

	async execCmd( cmd: string ) {

		const exists = await this.exists()
		if ( !exists ) await this.install()

		return await this.#exec( `brew ${cmd}` )

	}

}

export class Apps {

	#brew = new Brew()
	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async getOpenApps() {

		const res = await this.#exec( 'osascript -e \'tell application "System Events" to get name of (processes where background only is true)\'' )

		const backgroundApps = res.split( ', ' ).map( app => app.trim() )

		const allApps = await this.#exec( 'osascript -e \'tell application "System Events" to get name of (processes where background only is false)\'' )

		const foregroundApps = allApps.split( ', ' ).map( app => app.trim() )
		const all            = await this.getAll()
		const included       = ( all ).filter( d => [ ...backgroundApps, ...foregroundApps ].includes( d.name ) )
		console.debug( {
			all,
			backgroundApps,
			foregroundApps,
			included,
		} )
		const apps = included.map( app => {

			return {
				value      : app.name,
				path       : app.path,
				background : backgroundApps.includes( app.name ),
			}

		} )

		return apps

	}

	async askClose(  onClose?: ( app: string ) => Promise<unknown>  ) {

		const openApps = await this.getOpenApps()

		const closeApps = await promptMultipleSelect( 'Select app to be closed', openApps.map( d => d.value ) )
		if ( !closeApps.length ) return false
		for ( const app of closeApps ) {

			await this.#exec( `killall "${app}"` )
			onClose?.( app )

		}

		return true

	}

	async close( pattern: string[], onClose?: ( app: string ) => Promise<unknown>  ) {

		const openApps = await this.getOpenApps()

		const closeApps = getMatch( Object.values( openApps ).map( d => d.value ), pattern )
		if ( !closeApps.length ) return false
		for ( const app of closeApps ) {

			await this.#exec( `killall "${app}"` )
			onClose?.( app )

		}

		return true

	}

	async getAll( filter?: string[] ) {

		const cmd     = `ls ${PATH.APPLICATIONS_DIR} && ls ${PATH.SYS_APPLICATIONS_DIR}`
		const execRes = ( await this.#exec( cmd ) ).split( '\n' )
			.map( app => app.trim() )
			.filter( d => !( d === '' || d === undefined ) )
		const getName = ( v: string ) => getBaseName( v ).replaceAll( '.app', '' )

		const matched = filter ? getMatch( execRes.map( d => getName( d ) ), filter ) : execRes.map( d => getName( d ) )

		return execRes.map( d => ( {
			name : getName( d ),
			path : d,
		} ) ).filter( d => matched.includes( d.name ) )

	}

	async install( apps: string[] ) {

		return await this.#brew.execCmd( `install --cask ${apps.join( ' ' )}` )

	}

	async uninstall( apps: string[] ) {

		return await this.#brew.execCmd( `uninstall --cask ${apps.join( ' ' )}` )

	}

	async search( query: string ) {

		return await this.#brew.execCmd( `search --cask --desc ${query}` )

	}

	async getUndevPermissions(  ) {

		try {

			const res = await this.#exec( 'spctl --status' )
			return res.includes( 'assessments disabled' ) // is means that unid apps can be installed

		}
		catch ( _e ) {

			return true  // error means that is enabled

		}

	}

	async settUndevPermissions( action: boolean | 'toggle' ) {

		if ( action === 'toggle' )  action = !( await this.getUndevPermissions() )

		if ( action ) return await this.#exec( 'sudo spctl --master-disable; killall Finder' )

		return await this.#exec( 'sudo spctl --master-enable; killall Finder' )

	}

}
