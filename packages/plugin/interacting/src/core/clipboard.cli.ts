import {
	errorStyle,
	successStyle,
} from '@umac-js/utils'

import { CliCore }   from './_shared'
import { Clipboard } from './clipboard'

const clipboard = new Clipboard()

export const cliClipboard: CliCore = {
	cmd : {
		value : 'clipboard',
		desc  : 'Read or write the clipboard',
		cmds  : [
			{
				value    : 'read',
				desc     : 'Read the current clipboard content',
				examples : [
					{
						value : '$0 clipboard read',
						desc  : 'Print the clipboard content',
					},
				],
			},
			{
				value    : 'write',
				desc     : 'Write text to the clipboard',
				examples : [
					{
						value : '$0 clipboard write "Hello world!"',
						desc  : 'Copy text to the clipboard',
					},
				],
			},
		],
	},
	fn : async ( {
		argv,
		getHelp,
	} ) => {

		if ( argv.existsCmd( 'read' ) ) {

			const content = await clipboard.read()
			console.log( content )

		}
		else if ( argv.existsCmd( 'write' ) ) {

			const text = argv.getPositionalAfter( 'write' )
			if ( !text ) {

				console.log( errorStyle( 'Please provide a text after "write" command. Example: clipboard write "Hello world!"' ) )
				return

			}

			await clipboard.write( text )
			console.log( successStyle( 'Copied to clipboard' ) )

		}
		else console.log( await getHelp() )

	},
}
