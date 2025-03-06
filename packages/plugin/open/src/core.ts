import {
	exec,
	flag2Const,
	process,
	existsPath,
	getStringType,
} from '@umac/utils'

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

export class Open {

	PATHS = APP_PATH

	async run( filePath = process.cwd(), app?: string ): Promise<void> {

		const type = getStringType( filePath )

		if ( type !== 'url' && !( await existsPath( filePath ) ) )
			throw new Error( `The provided path does not exist: ${filePath}` )

		app           = app ? flag2Const( app ) : undefined
		const appPath = app && app in APP_PATH ? APP_PATH[app as keyof typeof APP_PATH] : app || undefined

		const command = appPath
			? `open -a "${appPath}" "${filePath}"`
			: `open "${filePath}"`

		try {

			const { stderr } = await exec( command )
			if ( stderr ) throw new Error( stderr.toString() )

		}
		catch ( error ) {

			// @ts-ignore
			throw new Error( `Failed to open file:\n\n${error.message}` )

		}

	}

}
