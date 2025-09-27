import { CliCore }  from './_shared'
import { Keyboard } from './keyboard'

const keyboard = new Keyboard()

export const cliKeyboard: CliCore = {
	cmd : {
		value : 'keyboard',
		desc  : 'Simulate keyboard input using AppleScript',
		cmds  : [
			{
				value : 'write',
				desc  : 'Type a string using keystrokes',
				flags : [
					{
						value : 'text',
						desc  : 'Text to type',
					},
				],
				examples : [
					{
						value : '$0 keyboard write "Hello world!"',
						desc  : 'Types "Hello world!"',
					},
				],
			},
			{
				value : 'press',
				desc  : 'Press a key or key combination',
				flags : [
					{
						value : 'key',
						desc  : 'Key to press (e.g., return, tab, f1, left_arrow)',
					},
					{
						value : 'modifiers',
						desc  : 'Comma-separated modifiers (e.g., command,shift)',
					},
				],
				examples : [
					{
						value : '$0 keyboard press --key return',
						desc  : 'Presses Return',
					},
					{
						value : '$0 keyboard press --key "f1" --modifiers command,shift',
						desc  : 'Presses Command + Shift + F1',
					},
				],
			},
			{
				value : 'codes',
				desc  : 'Show key codes available',
			},
			{
				value : 'modifiers',
				desc  : 'Show modifiers available',
			},
		],
	},
	fn : async ( {
		argv,
		getHelp,
	} ) => {

		if ( argv.existsCmd( 'write' ) ) {

			const text = argv.getPositionalAfter( 'write' )
			if ( !text ) throw new Error( 'Please provide a text after "write" command' )

			await keyboard.write( text )

		}
		else if ( argv.existsCmd( 'press' ) ) {

			const key = argv.getFlagValue( 'key' )
			if ( !key ) throw new Error( 'Please provide a key with --key' )

			const rawMods   = argv.getFlagValue( 'modifiers' )
			const modifiers = rawMods ? rawMods.split( ',' ).map( s => s.trim() ) : []
			// @ts-ignore
			await keyboard.press( [ key, modifiers ] )

		}
		else if ( argv.existsCmd( 'codes' ) ) {

			console.log( Object.keys( keyboard.CODE ).join( ', ' ) )

		}
		else if ( argv.existsCmd( 'modifiers' ) ) {

			console.log( Object.keys( keyboard.MODIFIERS ).join( ', ' ) )

		}
		else {

			console.log( await getHelp() )

		}

	},
}
