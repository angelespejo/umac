import {
	errorStyle,
	infoStyle,
} from '@umac-js/utils'

import { CliCore }  from './_shared'
import {
	Power,
	type BatteryInfo,
	type ChargerInfo,
	type CyclesInfo,
} from './power'

const power = new Power()

const printBattery = ( battery: BatteryInfo ) => {

	const parts = [ `${battery.percent}%`, battery.state ]
	if ( battery.remaining ) parts.push( `${battery.remaining} remaining` )
	if ( battery.source ) parts.push( battery.source )
	console.log( infoStyle( [ 'Battery', parts.join( ' · ' ) ] ) )

}

const printCycles = ( cycles: CyclesInfo ) => {

	const parts = [ `${cycles.cycleCount} cycles`, cycles.condition ]
	if ( cycles.healthPercent !== null ) parts.push( `${cycles.healthPercent}% health` )
	console.log( infoStyle( [ 'Cycles', parts.join( ' · ' ) ] ) )

}

const printCharger = ( charger: ChargerInfo ) => {

	const parts = charger.connected
		? [ charger.name || 'Connected' ]
		: [ 'Not connected' ]
	if ( charger.connected && charger.watts ) parts.push( `${charger.watts}W` )
	if ( charger.connected && charger.charging ) parts.push( 'charging' )
	console.log( infoStyle( [ 'Charger', parts.join( ' · ' ) ] ) )

}

export const cliPower: CliCore = {
	cmd : {
		value : 'power',
		desc  : 'Power and battery utilities. battery, cycles, charger...',
		flags : [
			{
				value : '--battery',
				desc  : 'Show battery status',
			},
			{
				value : '--cycles',
				desc  : 'Show battery cycles and health',
			},
			{
				value : '--charger',
				desc  : 'Show charger / adapter status',
			},
			{
				value : '-r, --res',
				desc  : 'Output format: "text" (default) or "json"',
			},
		],
		examples : [
			{
				value : '$0 power',
				desc  : 'Show battery, cycles and charger info',
			},
			{
				value : '$0 power --battery',
				desc  : 'Show only battery status',
			},
			{
				value : '$0 power --cycles --res=json',
				desc  : 'Show cycles info as JSON',
			},
		],
	},
	fn : async ( { argv } ) => {

		const format   = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'
		const hasFlags = argv.existsFlag( 'battery' ) || argv.existsFlag( 'cycles' ) || argv.existsFlag( 'charger' )

		try {

			const battery = hasFlags && !argv.existsFlag( 'battery' ) ? null : await power.battery()
			const cycles  = hasFlags && !argv.existsFlag( 'cycles' ) ? null : await power.cycles()
			const charger = hasFlags && !argv.existsFlag( 'charger' ) ? null : await power.charger()

			if ( format === 'json' ) {

				console.log( JSON.stringify( {
					battery,
					cycles,
					charger,
				}, null, 2 ) )
				return

			}

			if ( battery ) printBattery( battery )
			if ( cycles ) printCycles( cycles )
			if ( charger ) printCharger( charger )

		}
		catch ( e ) {

			console.log( errorStyle( ( e as Error ).message ) )

		}

	},
}
