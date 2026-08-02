import { spawn } from 'node:child_process'

export type SensorResult = {
	value  : number
	source : string
}

export type TemperatureData = {
	cpu?     : SensorResult | undefined
	gpu?     : SensorResult | undefined
	disk?    : SensorResult | undefined
	thermal? : string | undefined
}

export type TemperatureOptions = {
	cpu?     : boolean
	gpu?     : boolean
	disk?    : boolean
	thermal? : boolean
}

export class Temperature {

	#macmonCache : { cpu : number
		gpu                 : number } | undefined | undefined

	#archCache : 'arm' | 'intel' | undefined | undefined

	async #arch(): Promise<'arm' | 'intel' | undefined> {

		if ( this.#archCache !== undefined ) return this.#archCache

		const out       = await this.#exec( 'sysctl -n machdep.cpu.brand_string' )
		this.#archCache = out
			? out.includes( 'Apple' )
				? 'arm'
				: 'intel'
			: undefined
		return this.#archCache

	}

	/**
	 * Gets the CPU architecture of the machine.
	 *
	 * @returns {Promise<'apple-silicon' | 'intel' | 'unknown'>} - The detected architecture.
	 */
	async arch(): Promise<'apple-silicon' | 'intel' | 'unknown'> {

		const arch = await this.#arch()
		return arch === 'arm'
			? 'apple-silicon'
			: arch === 'intel'
				? 'intel'
				: 'unknown'

	}

	#exec( cmd: string ): Promise<string | undefined> {

		return new Promise( resolve => {

			const child = spawn( '/bin/sh', [ '-c', cmd ], {
				stdio : [
					'ignore',
					'pipe',
					'pipe',
				],
			} )

			let stdout = ''
			child.stdout.on( 'data', data => {

				stdout += data.toString()

			} )

			const done = ( value?: string ) => {

				clearTimeout( timer )
				resolve( value )

			}

			child.on( 'error', () => done( undefined ) )
			child.on( 'close', code => done( code === 0 ? stdout.trim() || undefined : undefined ) )

			const timer = setTimeout( () => {

				if ( child.exitCode === undefined ) child.kill()

			}, 5000 )

		} )

	}

	async #macmon(): Promise<{ cpu : number
		gpu                           : number } | undefined> {

		if ( this.#macmonCache !== undefined ) return this.#macmonCache

		const out = await this.#exec( 'macmon pipe -i 100 | head -n 1' )

		if ( !out ) {

			this.#macmonCache = undefined
			return undefined

		}

		try {

			const temp = JSON.parse( out ).temp
			const cpu  = Number( temp?.cpu_temp_avg )
			const gpu  = Number( temp?.gpu_temp_avg )

			this.#macmonCache = cpu > 0 || gpu > 0
				? {
					cpu,
					gpu,
				}
				: undefined

		}
		catch ( _e ) {

			this.#macmonCache = undefined

		}

		return this.#macmonCache

	}

	/**
	 * Gets the CPU temperature.
	 *
	 * Tries, in order: macmon (no sudo, Apple Silicon) and
	 * osx-cpu-temp (no sudo, Intel). Both are optional; if neither is
	 * installed, undefined is returned.
	 *
	 * @returns {Promise<SensorResult | undefined>} - The temperature and its source, or undefined if not available.
	 */
	async cpu(): Promise<SensorResult | undefined> {

		const macmon = await this.#macmon()
		if ( macmon && macmon.cpu > 0 ) return {
			value  : macmon.cpu,
			source : 'macmon',
		}

		const osx = await this.#exec( 'osx-cpu-temp' )
		if ( osx ) {

			const match = osx.match( /([\d.]+)\s*°C/ )
			const value = match ? Number( match[1] ) : 0
			if ( value > 0 ) return {
				value,
				source : 'osx-cpu-temp',
			}

		}

		return undefined

	}

	/**
	 * Gets the GPU temperature.
	 *
	 * Tries, in order: macmon (no sudo, Apple Silicon) and
	 * osx-cpu-temp (no sudo, Intel). Both are optional; if neither is
	 * installed, undefined is returned.
	 *
	 * @returns {Promise<SensorResult | undefined>} - The temperature and its source, or undefined if not available.
	 */
	async gpu(): Promise<SensorResult | undefined> {

		const macmon = await this.#macmon()
		if ( macmon && macmon.gpu > 0 ) return {
			value  : macmon.gpu,
			source : 'macmon',
		}

		const osx = await this.#exec( 'osx-cpu-temp -g' )
		if ( osx ) {

			const match = osx.match( /([\d.]+)\s*°C/ )
			const value = match ? Number( match[1] ) : 0
			if ( value > 0 ) return {
				value,
				source : 'osx-cpu-temp',
			}

		}

		return undefined

	}

	/**
	 * Gets the disk (SSD) temperature using smartctl.
	 *
	 * @param   {string}                            [device] - The device to check. Default: /dev/disk0.
	 * @returns {Promise<SensorResult | undefined>}          - The temperature and its source, or undefined if not available.
	 */
	async disk( device: string = '/dev/disk0' ): Promise<SensorResult | undefined> {

		const out = await this.#exec( `smartctl -A ${device}` )
		if ( out ) {

			const match = out.match( /Temperature:\s*(\d+)\s*Celsius/ )
			if ( match ) return {
				value  : Number( match[1] ),
				source : 'smartctl',
			}

		}

		return undefined

	}

	/**
	 * Gets the thermal pressure of the system.
	 *
	 * @returns {Promise<string | undefined>} - The thermal pressure level, or undefined if not available.
	 */
	async thermal(): Promise<string | undefined> {

		const out = await this.#exec( 'pmset -g therm' )
		if ( !out ) return undefined
		if ( out.includes( 'No thermal warning level' ) ) return 'Nominal'

		const raw = out
			.split( '\n' )
			.map( line => line.trim() )
			.filter( line => line && !line.startsWith( 'Note:' ) )

		return raw.length ? raw.join( ', ' ) : 'Nominal'

	}

	/**
	 * Gets the requested temperatures. By default returns all of them.
	 *
	 * @param   {TemperatureOptions}       [options] - Which sensors to include. Default: all.
	 * @returns {Promise<TemperatureData>}           - The temperatures and their sources.
	 */
	async get( options: TemperatureOptions = {} ): Promise<TemperatureData> {

		const res: TemperatureData = {}

		if ( options.cpu !== false ) res.cpu = await this.cpu()
		if ( options.gpu !== false ) res.gpu = await this.gpu()
		if ( options.disk !== false ) res.disk = await this.disk()
		if ( options.thermal !== false ) res.thermal = await this.thermal()

		return res

	}

}
