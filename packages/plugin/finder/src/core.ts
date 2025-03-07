import { exec } from '@umac-js/utils'

class FinderSuper {

	protected async exec( cmd:string ) {

		const {
			stderr, stdout,
		} = await exec( cmd )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

}
export class FinderFiles  extends FinderSuper {

	async isShowingAll(): Promise<boolean> {

		const {
			stdout, stderr,
		} = await exec( 'defaults read com.apple.finder AppleShowAllFiles' )

		if ( stderr ) return false
		return stdout.toString().trim() === '1'

	}

	async showAll( value: boolean | 'toggle' ) {

		if ( value === 'toggle' ) value = !( await this.isShowingAll() )

		const command = `defaults write com.apple.finder AppleShowAllFiles ${value ? 1 : 0} && killall Finder`
		await this.exec( command )

		return await this.isShowingAll()

	}

}

export class Finder extends FinderSuper {

	files = new FinderFiles()

	async reload() {

		return await this.exec( `killall Finder` )

	}

	async close() {

		const command = `osascript -e 'tell application "Finder" to quit' && osascript -e 'tell application "Finder" to activate'`
		return await this.exec( command )

	}

}

