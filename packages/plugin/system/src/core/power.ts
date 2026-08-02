import { execute } from './_shared'

export type BatteryState = 'charging' | 'discharging' | 'finished' | 'unknown'

export type BatteryInfo = {
	percent   : number
	remaining : string | null
	state     : BatteryState
	source    : string | null
}

export type CyclesInfo = {
	cycleCount     : number
	condition      : string
	healthPercent  : number | null
	designCapacity : number | null
	maxCapacity    : number | null
}

export type ChargerInfo = {
	connected : boolean
	charging  : boolean
	name      : string | null
	watts     : number | null
}

type PowerDataItem = Record<string, unknown> & {
	_name?                       : string
	sppower_battery_health_info?           : {
		sppower_battery_cycle_count?             : number | string
		sppower_battery_health?                  : string
		sppower_battery_health_maximum_capacity? : string
	}
	sppower_battery_charge_info?    : Record<string, unknown>
	sppower_ac_charger_information?        : {
		sppower_ac_charger_name?           : string
		sppower_ac_charger_watts?          : string
		sppower_battery_charger_connected? : string
		sppower_battery_is_charging?       : string
	}
	BatteryInformation?                    : {
		CycleCount?     : number | string
		Condition?      : string
		DesignCapacity? : number | string
		MaxCapacity?    : number | string
	}
	ACChargerInformation?                  : {
		Connected? : string
		Charging?  : string
		Name?      : string
	}
}

export class Power {

	#getProfiler(): Promise<{ SPPowerDataType?: PowerDataItem[] }> {

		return execute( 'system_profiler SPPowerDataType -json' )
			.then( output => JSON.parse( output ) )

	}

	/**
	 * Gets the current battery status.
	 *
	 * @returns {Promise<BatteryInfo>} - The current battery info.
	 * @example
	 * const battery = await power.battery()
	 * console.log( battery ) // { percent: 52, state: 'charging', ... }
	 */
	async battery(): Promise<BatteryInfo> {

		const output = await execute( 'pmset -g batt' )
		const line   = output.split( '\n' ).find( l => l.includes( '%' ) )

		if ( !line ) throw new Error( 'No battery found' )

		const percentMatch = line.match( /(\d+)%/ )
		const stateMatch   = line.match( /;\s*(\w+(?:\s+\w+)?)/ )
		const remaining    = line.match( /;\s+([\w:]+)\s+remaining/ )
		const source       = output.match( /drawing from '([^']+)'/ )

		const stateRaw = stateMatch?.[1] || 'unknown'
		const state    = stateRaw.startsWith( 'discharg' )
			? 'discharging'
			: stateRaw.startsWith( 'finishing' ) || stateRaw.startsWith( 'charged' )
				? 'finished'
				: stateRaw.startsWith( 'charg' )
					? 'charging'
					: 'unknown'

		return {
			percent   : Number( percentMatch?.[1] || 0 ),
			remaining : remaining?.[1] || null,
			state,
			source    : source?.[1] || null,
		}

	}

	/**
	 * Gets the battery cycles, condition and health.
	 *
	 * @returns {Promise<CyclesInfo>} - The battery health info.
	 * @example
	 * const cycles = await power.cycles()
	 * console.log( cycles ) // { cycleCount: 257, condition: 'Good', ... }
	 */
	async cycles(): Promise<CyclesInfo> {

		const data  = await this.#getProfiler()
		const items = data?.SPPowerDataType || []

		const health = items.find( item => item.sppower_battery_health_info )?.sppower_battery_health_info
		const legacy = items.find( item => item.BatteryInformation )?.BatteryInformation

		const designCapacity = legacy?.DesignCapacity ? Number( legacy.DesignCapacity ) : null
		const maxCapacity    = legacy?.MaxCapacity ? Number( legacy.MaxCapacity ) : null
		const healthPercent  = health?.sppower_battery_health_maximum_capacity
			? parseInt( String( health.sppower_battery_health_maximum_capacity ), 10 )
			: designCapacity && maxCapacity
				? Math.round( ( maxCapacity / designCapacity ) * 100 )
				: null

		return {
			cycleCount : Number( health?.sppower_battery_cycle_count ?? legacy?.CycleCount ?? 0 ),
			condition  : health?.sppower_battery_health ?? legacy?.Condition ?? 'unknown',
			healthPercent,
			designCapacity,
			maxCapacity,
		}

	}

	/**
	 * Gets the charger / power adapter status.
	 *
	 * @returns {Promise<ChargerInfo>} - The charger info.
	 * @example
	 * const charger = await power.charger()
	 * console.log( charger ) // { connected: true, charging: true, ... }
	 */
	async charger(): Promise<ChargerInfo> {

		const data  = await this.#getProfiler()
		const items = data?.SPPowerDataType || []

		const chargerItem = items.find( item => item._name === 'sppower_ac_charger_information' )
		const legacy      = items.find( item => item.ACChargerInformation )?.ACChargerInformation

		return {
			connected : chargerItem
				? chargerItem.sppower_battery_charger_connected === 'TRUE'
				: legacy
					? legacy.Connected === 'Yes'
					: false,
			charging : chargerItem
				? chargerItem.sppower_battery_is_charging === 'TRUE'
				: legacy
					? legacy.Charging === 'Yes'
					: false,
			// @ts-ignore
			name  : chargerItem?.sppower_ac_charger_name?.trim() || legacy?.Name || null,
			watts : chargerItem?.sppower_ac_charger_watts
				? Number( chargerItem.sppower_ac_charger_watts )
				: null,
		}

	}

}
