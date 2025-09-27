import { CliCore } from './_shared'
import { Siri }    from './siri'

export const cliSiri: CliCore = {
	cmd : {
		desc  : 'Interact with Siri',
		value : 'siri',
	},
	fn : async () => {

		await ( new Siri() ).open()

	},
}
