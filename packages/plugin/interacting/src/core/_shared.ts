import {
	exec,
	type UmacCommandOpts,
} from '@umac-js/utils'

export type CliCore = {
	cmd : NonNullable<NonNullable<UmacCommandOpts['helpOpts']>['cmds']>[number]
	fn  : UmacCommandOpts['fn']
}

export const execute = async ( cmd: string ) => {

	const {
		stderr,
		stdout,
	} = await exec( cmd )

	// if ( stderr ) console.warn( stderr.toString() )
	if ( stderr ) throw new Error( stderr.toString() )
	return stdout.toString()

}
