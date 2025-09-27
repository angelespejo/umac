import { infoStyle } from '@umac-js/utils'

import { CliCore } from './_shared'
import { Sleep }   from './sleep'

const sleep =  new Sleep()

export const cliSleepNow: CliCore = {
	cmd : {
		desc  : 'Sleep system now',
		value : 'sleep-now',
		flags : [
			{
				value : '--force',
				desc  : 'Force sleep',
			},
		],
	},
	fn : async ( { argv } ) => {

		await sleep.now( argv.existsFlag( 'force' ) )

	},
}

export const cliSleep: CliCore = {
	cmd : {
		value : 'sleep',
		desc  : 'Sleep mode utilities. toggle, set, get...',
		flags : [
			{
				value : '--toggle',
				desc  : 'Toggle sleep mode',
			},
			{
				value : '--enable',
				desc  : 'Enable sleep mode',
			},
			{
				value : '--disable',
				desc  : 'Disable sleep mode',
			},
		],
	},
	fn : async ( { argv } ) => {

		const toggle  = argv.existsFlag( 'toggle' )
		const enable  = argv.existsFlag( 'enable' )
		const disable = argv.existsFlag( 'disable' )
		const status  = await sleep.getStatus()

		const res =  !( toggle || enable || disable )
			? status
			: await sleep.setMode(
				toggle
					? !status
					: enable ? true : disable ? false : status,
			)

		// console.log( {
		// 	toggle,
		// 	enable,
		// 	disable,
		// 	res,
		// 	status,
		// } )
		console.log( infoStyle( [ 'Sleep Mode Status', res ? 'Enabled' : 'Disabled' ] ) )

	},
}
