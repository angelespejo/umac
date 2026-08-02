
import { execute } from './_shared'

export class Siri {

	/**
	 * Open Siri app.
	 */
	async open() {

		await execute( `open "/System/Applications/Siri.app"` )

	}

	/**
	 * Speak the given text through Siri.
	 *
	 * @param {string} text - Text to speak.
	 * @experimental
	 */
	async speakText( text: string ) {

		const escapedText = text.replace( /"/g, '\\"' )
		const script      = `
			tell application "System Events"
				keystroke "${escapedText}"
				key code 36
			end tell
		`
		await execute( `osascript -e '${script}'` )

	}

}
