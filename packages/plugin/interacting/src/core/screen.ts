
import { execSync } from 'node:child_process'

import { execute } from './_shared'

export type ScreenSharedOptions = {
	/**
	 * Include the cursor in the screenshot.
	 * Only works in non-interactive modes.
	 *
	 * @default false
	 */
	includeCursor? : boolean

	/**
	 * Suppress the camera shutter sound.
	 *
	 * @default false
	 */
	silent? : boolean

	/**
	 * Open the captured image in Preview after capture.
	 *
	 * @default false
	 */
	preview? : boolean

	/**
	 * Delay the capture by the specified number of seconds.
	 *
	 * @default 5
	 */
	delay? : number

	/**
	 * present UI after screencapture is complete.
	 *
	 * @default false
	 */
	showUI? : boolean

}

export type ScreenCaptureOptions = ScreenSharedOptions & {

	/**
	 * Image format for the output file.
	 * Supported formats: png, jpg, tiff, pdf, etc.
	 *
	 * @default "png"
	 */
	format? : 'pdf' | 'jpg' | 'png' | 'tiff' | ( string & {} )

	/**
	 * Do not capture the shadow of the window.
	 * Only applies in window capture mode.
	 *
	 * @default true
	 */
	shadow? : boolean

	/**
	 * Capture mode.
	 *
	 * @default "fullScreen"
	 */
	mode? : 'fullScreen' | [number, number, number, number] | 'window' | 'interactive'
}

export type ScreenVideoOptions = ScreenSharedOptions & {

	/**
	 * video format for the output file.
	 *
	 * @default "mov"
	 */
	format? : 'mov' | 'mp4' | ( string & {} )

	/**
	 * Duration of the video capture in seconds.
	 *
	 * @default undefined (no limit)
	 */
	videoDuration? : number

	/**
	 * Enable audio recording using default input.
	 *
	 * @default false
	 */
	audio? : boolean

	/**
	 * Record audio from a specific audio input device ID.
	 *
	 * @default undefined
	 */
	audioDeviceId? : number

	/**
	 * Show mouse clicks in the video.
	 *
	 * @default false
	 */
	showClicks? : boolean

	/**
	 * Capture mode.
	 *
	 * @default "fullScreen"
	 */
	mode? : 'fullScreen' | [number, number, number, number]
}

export class Screen {

	#buildFlagsFromOptions( options?: ScreenCaptureOptions ): string[] {

		const flags: string[] = []

		if ( options?.silent ?? true ) flags.push( '-x' ) // default: silent
		if ( options?.shadow === false ) flags.push( '-o' ) // no shadow only if explicitly false
		if ( options?.includeCursor ) flags.push( '-C' )
		if ( options?.preview ) flags.push( '-P' )
		if ( typeof options?.delay === 'number' ) flags.push( `-T${options.delay}` )
		if ( options?.format ) flags.push( `-t${options.format}` )
		if ( options?.showUI ) flags.push( '-u' )
		return flags

	}

	#buildVideoFlagsFromOptions( options?: ScreenVideoOptions ): string[] {

		const flags = this.#buildFlagsFromOptions( options )

		flags.push( '-v' )
		if ( typeof options?.videoDuration === 'number' ) flags.push( `-V${options.videoDuration}` )
		if ( options?.audio ) flags.push( '-g' )
		if ( typeof options?.audioDeviceId === 'number' ) flags.push( `-G${options.audioDeviceId}` )
		if ( options?.showClicks ) flags.push( '-k' )
		return flags

	}

	/**
	 * Captures a screenshot of the screen. Supports three capture modes:
	 * - 'fullScreen': captures the full screen. Default mode.
	 * - [x, y, width, height]: captures a region of the screen.
	 * - 'window': captures a window (requires user interaction).
	 *
	 * @param   {string}                outputPath - Path to save the screenshot.
	 * @param   {ScreenCaptureOptions } options    - Options for the method.
	 * @returns {Promise<string>}                  - The output of the method.
	 * @example
	 * this.capture('/tmp/fullscreen.png', { mode: 'fullScreen' })
	 * this.capture('/tmp/region.png', { mode: [100, 100, 400, 300] })
	 * this.capture('/tmp/window.png', { mode: 'window' })
	 * this.capture('/tmp/interactive.png', { mode: 'interactive' })
	 */
	async capture( outputPath: string, options?: ScreenCaptureOptions ) {

		const flags = this.#buildFlagsFromOptions( options )
		if ( Array.isArray( options?.mode ) ) {

			if ( options.mode.length !== 4 ) throw new Error( 'Region should be an array with [x, y, width, height]' )

			flags.push( `-R${options.mode.join( ',' )}` )

		}
		else if ( options?.mode === 'window' ) flags.push( '-w' ) // window mode
		else if ( options?.mode === 'interactive' ) flags.push( '-i' ) // interactive mode
		const cmd = `screencapture ${flags.join( ' ' )} "${outputPath}"`

		return await execute( cmd )

	}

	/**
	 * Records a video of the full screen or a region of the screen.
	 *
	 * @param   {string}             outputPath - Path to save the video.
	 * @param   {ScreenVideoOptions} [options]  - Options for the method.
	 * @returns {Promise<void>}                 - The output of the method.
	 * @example
	 * this.record('/tmp/fullscreen.mov')
	 * this.record('/tmp/region.mov', {mode: [100, 100, 400, 300]})
	 */
	async record( outputPath: string, options?: ScreenVideoOptions ) {

		const flags = this.#buildVideoFlagsFromOptions( options )

		if ( Array.isArray( options?.mode ) ) {

			if ( options.mode.length !== 4 ) throw new Error( 'Region should be an array with [x, y, width, height]' )

			flags.push( `-R${options.mode.join( ',' )}` )

		}
		const cmd = `screencapture ${flags.join( ' ' )} "${outputPath}"`
		return await execSync( cmd )

	}

}
