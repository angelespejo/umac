import {
	copyFile,
	exec,
	existsFile,
	joinPath,
	PATH,
	promptSelect,
	removePathIfExist,
} from '@umac-js/utils'

export class Desktop {

	async #exec( cmd:string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	private deskPicksFolder( sys: boolean = false ): string {

		return sys
			? PATH.SYS_DESK_PICS_DIR
			: `${process.env.HOME}/Library/Application Support/com.apple.desktop.admin`

	}

	private async deskPicsValidate( filePath: string ): Promise<boolean> {

		return await existsFile( filePath )

	}

	async deskPicsAdd( filePath: string, sys: boolean = false ) {

		if ( !( await this.deskPicsValidate( filePath ) ) ) return

		const dest        = this.deskPicksFolder( sys )
		const pictureName = filePath.split( '/' ).pop()
		const destPath    = joinPath( dest, pictureName! )

		if ( await existsFile( destPath ) ) return

		await copyFile( {
			input  : filePath,
			output : dest,
		} )

	}

	async deskPicsChange( filePath: string, sys: boolean = false ) {

		if ( !( await this.deskPicsValidate( filePath ) ) ) return

		const dest         = this.deskPicksFolder( sys )
		const pictureName  = filePath.split( '/' ).pop()
		const fileDestPath = joinPath( dest, pictureName! )

		if ( !( await existsFile( fileDestPath ) ) ) await copyFile( {
			input  : filePath,
			output : dest,
		} )

		await this.#exec( `osascript -e 'tell application "System Events" to set picture of every desktop to "${fileDestPath}"'` )

	}

	async deskPicsRemove() {

		const folder = this.deskPicksFolder()
		const files  = await this.#exec( `ls "${folder}"` )

		const options  = files.split( '\n' )
		const selected = await promptSelect( 'Select a picture to remove:', options )

		const filePath = joinPath( folder, selected )
		await removePathIfExist( filePath )

	}

	async deskPicsRemoveArgs( files: string[] ) {

		const folder = this.deskPicksFolder()

		for ( const file of files ) {

			const filePath = joinPath( folder, file )
			await removePathIfExist( filePath )

		}

	}

	async deskPics( action: 'add' | 'change' | 'remove', value?: string ) {

		if ( action === 'add' ) {

			if ( !value ) throw new Error( 'You need to provide a file path' )
			await this.deskPicsAdd( value )

		}
		else if ( action === 'change' ) {

			if ( !value ) throw new Error( 'You need to provide a file path' )
			await this.deskPicsChange( value )

		}
		else if ( action === 'remove' ) {

			if ( value ) await this.deskPicsRemoveArgs( value.split( ',' ) )
			else await this.deskPicsRemove()

		}

	}

}

