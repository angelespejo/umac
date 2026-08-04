import {
	exec,
	process,
	existsPath,
	getStringType,

} from '@umac-js/utils'

export const APP_PATH = {
	CHROME    : '/Applications/Google Chrome.app',
	FIREFOX   : '/Applications/Firefox.app',
	SAFARI    : '/Applications/Safari.app',
	OPERA     : '/Applications/Opera.app',
	TOR       : '/Applications/Tor Browser.app',
	EDGE      : '/Applications/Microsoft Edge.app',
	BRAVE     : '/Applications/Brave Browser.app',
	VIVALVI   : '/Applications/Vivaldi.app',
	VSCODE    : '/Applications/Visual Studio Code.app',
	TEXT_EDIT : '/System/Applications/TextEdit.app',
	PREVIEW   : '/System/Applications/Preview.app',
} as const

export type OpenAppOption = string | {
	value : string
	type  : 'app' | 'bundle'
} | {
	type : 'browser-default'
}
export class Open {

	async #exec( cmd:string ) {

		const {
			stderr, stdout,
		} = await exec( cmd )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	/**
	 * Retrieves the Bundle Identifier of the default web browser configured in macOS
	 * by querying LaunchServices defaults.
	 *
	 * @returns {Promise<string>} A promise that resolves to the command execution result containing the Bundle ID (e.g., "com.brave.browser").
	 */
	async #fetchDefaultBrowserBundleId(): Promise<string> {

		const res = await this.#exec(
			`defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers 2>/dev/null | awk -v RS="}" '/LSHandlerURLScheme = http/ {print $0}' | grep "LSHandlerRoleAll =" | head -n1 | cut -d '"' -f 2`,
		)
		return res.trim()

	}

	/**
	 * Opens a file or URL with the specified application or default macOS handler.
	 *
	 * @param   {string}        filePath - The target file path or URL to open.
	 * @param   {OpenAppOption} [app]    - Target application name/path, Bundle ID object `{ value, type }`, or string.
	 * @returns {Promise<void>}
	 */
	async run( filePath = process.cwd(), app?: OpenAppOption ): Promise<void> {

		const type = getStringType( filePath )

		if ( type !== 'url' && !( await existsPath( filePath ) ) )
			throw new Error( `The provided path does not exist: ${filePath}` )

		let command: string

		if ( app ) {

			if ( typeof app === 'object' ) {

				if ( app.type === 'browser-default' ) {

					const id = await this.#fetchDefaultBrowserBundleId()
					command  = `open -b "${id}" "${filePath}"`

				}
				else
					command = `open ${app.type === 'bundle' ? '-b' : '-a'} "${app.value}" "${filePath}"`

			}
			else {

				const appPath = app in APP_PATH ? APP_PATH[app as keyof typeof APP_PATH] : app || undefined
				command       = appPath ? `open -a "${appPath}" "${filePath}"` : `open ${filePath}`

			}

		}
		else {

			command = `open "${filePath}"`

		}

		try {

			const { stderr } = await exec( command )
			if ( stderr ) throw new Error( stderr.toString() )

		}
		catch ( error ) {

			// @ts-ignore
			throw new Error( `Failed to open file:\n\n${error.message}`, { cause: error } )

		}

	}

}
