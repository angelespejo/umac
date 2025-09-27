
import { exec } from '@umac-js/utils'

import {
	Key,
	KEY_CODE,
} from './key-list'

export const MODIFIERS = {
	command  : 'command down',
	shift    : 'shift down',
	option   : 'option down',
	control  : 'control down',
	capsLock : 'caps lock down',
}

export type KeyModifier = keyof typeof MODIFIERS

type PressValue = [Key, KeyModifier[]] | Key

/**
 * Utility class for simulating key presses in macOS using AppleScript via osascript.
 * Supports function keys (by key code), alphanumeric keys, sequences, and modifier combinations.
 */
export class Keyboard {

	CODE = KEY_CODE
	MODIFIERS = MODIFIERS

	async #exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	async #press( value: Key, modifiers: KeyModifier[] = [] ) {

		if ( Object.keys( KEY_CODE ).includes( value as string ) === false )
			throw new Error( 'keyCode must be a valid code' )

		let mods = ''
		if ( modifiers.length ) {

			for ( const mod of modifiers )
				if ( !Object.keys( MODIFIERS ).includes( mod ) )
					throw new Error( `Modifier "${mod}" is not valid` )

			mods = ` using {${modifiers.join( ', ' )}}`

		}
		// console.log( KEY_CODE[value] )
		await this.#exec( `osascript -e 'tell application "System Events" to key code ${KEY_CODE[value]}${mods}'` )

	}

	async write( value: string ) {

		await this.#exec( `osascript -e 'tell application "System Events" to keystroke "${value}"'` )

	}

	async press( value: PressValue[] | PressValue ) {

		if ( !Array.isArray( value ) ) return await this.#press( value )

		for ( const k of value ) {

			if ( typeof k === 'string' ) await this.#press( k )
			// @ts-ignore
			else if ( Array.isArray( k ) ) await this.#press( k[0], k[1] )

		}

	}

}
