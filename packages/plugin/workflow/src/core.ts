import {
	PATH,
	exec,
	promptSelect,
	ensureDir,
	copyDir,
	readDir,
	joinPath,
} from '@umac-js/utils'

export const WORKFLOW_CMD = {
	LIST     : 'list',
	COPY     : 'copy',
	OPEN_DIR : 'open-dir',
	OPEN     : 'open',
	NEW      : 'new',
} as const
export type WorkflowType = ( typeof WORKFLOW_CMD )[keyof typeof WORKFLOW_CMD]

export const WORKFLOW_DESCRIPTIONS: { [key in WorkflowType]: string } = {
	[WORKFLOW_CMD.LIST]     : 'Lists all available workflows in the services directory.',
	[WORKFLOW_CMD.COPY]     : 'Copies all workflows to the specified directory.',
	[WORKFLOW_CMD.OPEN_DIR] : 'Opens the services directory in the file explorer.',
	[WORKFLOW_CMD.OPEN]     : 'Prompts the user to select and open a workflow with Automator.',
	[WORKFLOW_CMD.NEW]      : 'Opens a new project in Automator.',
}

export class Workflow {

	#servicesDir        = PATH.SERVICES_DIR

	async #exec( cmd:string ) {

		const {
			stderr, stdout,
		} = await exec( cmd )
		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async list() {

		const files = ( await readDir( this.#servicesDir ) ).map( file => joinPath( file.parentPath, file.name ) )
		return files

	}

	async copy( scriptServicesDir?: string ): Promise<void> {

		if ( !scriptServicesDir )
			throw new Error( 'You need to provide a destination directory' )

		await ensureDir( scriptServicesDir )

		await copyDir( {
			input  : this.#servicesDir,
			output : scriptServicesDir,
		} )

	}

	async openDir() {

		return await this.#exec( `open "${this.#servicesDir}"` )

	}

	async open() {

		const services = ( await readDir( this.#servicesDir ) ).map( file => file.name )

		const selectedService = await promptSelect( 'Select workflow to open:', services )

		const servicePath = joinPath( this.#servicesDir, selectedService )
		return await this.#exec( `open -a /System/Applications/Automator.app "${servicePath}"` )

	}

	async new() {

		return await this.#exec( 'open -a "Automator"' )

	}

}

