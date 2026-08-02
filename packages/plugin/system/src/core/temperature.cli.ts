import {
	infoStyle,
	warnStyle,
} from '@umac-js/utils'

import { CliCore }          from './_shared'
import {
	Temperature,
	type SensorResult,
	type TemperatureOptions,
} from './temperature'

const temperature = new Temperature()

const HINTS = {
	'apple-silicon' : {
		CPU  : 'not available. Optional: install "macmon" (brew install macmon)',
		GPU  : 'not available. Optional: install "macmon" (brew install macmon)',
		DISK : 'not available. Optional: install "smartmontools" (brew install smartmontools)',
	},
	'intel' : {
		CPU  : 'not available. Optional: install "osx-cpu-temp"',
		GPU  : 'not available. Optional: install "osx-cpu-temp"',
		DISK : 'not available. Optional: install "smartmontools" (brew install smartmontools)',
	},
	'unknown' : {
		CPU  : 'not available. Optional: install "macmon" or "osx-cpu-temp"',
		GPU  : 'not available. Optional: install "macmon" or "osx-cpu-temp"',
		DISK : 'not available. Optional: install "smartmontools" (brew install smartmontools)',
	},
} as const

const round = ( value: number ) => Math.round( value * 10 ) / 10

const printSensor = ( label: string, sensor: SensorResult | null, hint: string ) => {

	if ( sensor ) console.log( infoStyle( [ label, `${round( sensor.value )}°C (${sensor.source})` ] ) )
	else console.log( warnStyle( [ label, hint ] ) )

}

export const cliTemperature: CliCore = {
	cmd : {
		value : 'temp',
		desc  : 'Show system temperatures. CPU, GPU, disk and thermal pressure',
		flags : [
			{
				value : '--cpu',
				desc  : 'Show CPU temperature',
			},
			{
				value : '--gpu',
				desc  : 'Show GPU temperature',
			},
			{
				value : '--disk',
				desc  : 'Show disk (SSD) temperature',
			},
			{
				value : '--thermal',
				desc  : 'Show thermal pressure',
			},
			{
				value : '-r, --res',
				desc  : 'Output format: "text" (default) or "json"',
			},
		],
		examples : [
			{
				value : '$0 temp',
				desc  : 'Show all temperatures',
			},
			{
				value : '$0 temp --cpu',
				desc  : 'Show only the CPU temperature',
			},
			{
				value : '$0 temp --res=json',
				desc  : 'Show all temperatures as JSON',
			},
		],
	},
	fn : async ( { argv } ) => {

		const format = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'

		const hasFlags = argv.existsFlag( 'cpu' ) || argv.existsFlag( 'gpu' )
			|| argv.existsFlag( 'disk' ) || argv.existsFlag( 'thermal' )

		const opts: TemperatureOptions = hasFlags
			? {
				cpu     : argv.existsFlag( 'cpu' ),
				gpu     : argv.existsFlag( 'gpu' ),
				disk    : argv.existsFlag( 'disk' ),
				thermal : argv.existsFlag( 'thermal' ),
			}
			: {}

		const requested: TemperatureOptions = hasFlags
			? opts
			: {
				cpu     : true,
				gpu     : true,
				disk    : true,
				thermal : true,
			}

		const res = await temperature.get( opts )

		if ( format === 'json' ) {

			console.log( JSON.stringify( res ) )
			return

		}

		const hints = HINTS[await temperature.arch()]

		if ( requested.cpu ) printSensor( 'CPU', res.cpu || null, hints.CPU )
		if ( requested.gpu ) printSensor( 'GPU', res.gpu || null, hints.GPU )
		if ( requested.disk ) printSensor( 'Disk', res.disk || null, hints.DISK )

		if ( requested.thermal ) {

			if ( res.thermal ) console.log( infoStyle( [ 'Thermal', res.thermal ] ) )
			else console.log( warnStyle( [ 'Thermal', 'not available' ] ) )

		}

	},
}
