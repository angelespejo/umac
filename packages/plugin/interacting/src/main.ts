import {
	UmacCommand,
	warnStyle,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Alert }       from './core/alert'
import { Dialog }      from './core/dialog'
import { Interacting } from './core/main'
import {
	NotificationOpts,
	Notification,
} from './core/notification'
import {
	Prompt,
	PromptInputOpt,
} from './core/prompt'
import { Say } from './core/say'

export {
	Notification,
	Alert,
	Dialog,
	Say,
	Prompt,
}
export const CMD = {
	DIALOG        : 'dialog',
	ALERT         : 'alert',
	NOTFICATION   : 'notification',
	SAY           : 'say',
	PROMPT        : 'prompt',
	PROMPT_COLOR  : 'color',
	PROMPT_INPUT  : 'input',
	PROMPT_SELECT : 'select',
	PROMPT_FILE   : 'file',
	PROMPT_FOLDER : 'folder',
} as const
export type Cmd = ( typeof CMD )[keyof typeof CMD]

const flagsDialogShared = [
	{
		value : '--desc',
		desc  : 'Set a description. Required',
	},
	{
		value : '--cancel-btn',
		desc  : 'Set button for cancel',
	},
	{
		value : '--default-btn',
		desc  : 'Set button for default',
	},
]
const flags             = [
	...flagsDialogShared,
	{
		value : '--extra-btn',
		desc  : 'Set extra button',
	},
]
const fileFlags         = [
	{
		value : '--multiple',
		desc  : 'Allow multiple items to be selected',
	},
	{
		value : '--dotfiles',
		desc  : 'Show hidden files (dotfiles)',
	},
	{
		value : '--title',
		desc  : 'Set the title of the dialog',
	},
	{
		value : '--default-location',
		desc  : 'Set the default location for the file dialog',
	},
	{
		value : '--show-package-contents',
		desc  : 'Show the contents of packages (treat them as folders)',
	},
]
const dialogFlags       = [
	...flags,
	{
		value : '--title',
		desc  : 'Set title for dialog',
	},
	{
		value : '--icon',
		desc  : 'Set icon for dialog. Choices: note, stop, caution',
	},
]
const normalizeArray    = ( arr: ( number | string )[] ): [number, number, number] => {

	return arr
		.map( item => Number( item ) )
		.slice( 0, 3 )
		.concat( Array( Math.max( 0, 3 - arr.length ) ).fill( 0 ) ) as  [number, number, number]

}

export const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : { cmds : [
		{
			value : CMD.NOTFICATION,
			desc  : 'Set a macOS notification',
			flags : [
				flags[0],
				{
					value : '--title',
					desc  : 'Set title',
				},

				{
					value : '--subtitle',
					desc  : 'Set subtitle for notification',
				},
				{
					value : '--sound',
					desc  : 'Set a custom sound',
				},
			],
		},
		{
			value : CMD.DIALOG,
			desc  : 'Set a macOS dialog',
			flags : dialogFlags,
		},
		{
			value : CMD.ALERT,
			desc  : 'Set a macOS alert',
			flags : [
				...flags,
				{
					value : '--as',
					desc  : 'Set icon for alert. Choices: critical',
				},
			],
		},
		{
			value : CMD.SAY,
			desc  : 'Display voice message',
			flags : [ flags[0] ],
		},
		{
			value : CMD.PROMPT,
			desc  : 'Set custom prompts like, text, choices, files, color etc',
			cmds  : [
				{
					value : CMD.PROMPT_FILE,
					desc  : 'Folder prompt',
					flags : [
						...fileFlags,
						{
							value : '--type',
							desc  : 'Specify allowed file types',
						},
					],
				},
				{
					value : CMD.PROMPT_FOLDER,
					desc  : 'Folder prompt',
					flags : fileFlags,
				},
				{
					value : CMD.PROMPT_COLOR,
					desc  : 'Color prompt',
					flags : [
						{
							value : 'default',
							desc  : 'Default RGA color. Must be a array. --default 255 255 0',
						},
					],
					examples : [
						{
							value : '$0 prompt color --default 255 255 0',
							desc  : 'Set color dialog with default color',
						},
					],
				},
				{
					value : CMD.PROMPT_SELECT,
					desc  : 'Select prompt',
					flags : [
						...flagsDialogShared,
						{
							value : '--title',
							desc  : 'Set title for notification',
						},
						{
							value : '--items',
							desc  : 'Set select items',
						},
						{
							value : '--default-items',
							desc  : 'Set default items',
						},
						{
							value : '--multiple',
							desc  : 'Allow multiple items to be selected',
						},
						{
							value : '--empty',
							desc  : 'Allow empty selection',
						},
					],
				},
				{
					value : CMD.PROMPT_INPUT,
					desc  : 'File prompt',
					flags : [
						...dialogFlags,
						{
							value : '--hidden',
							desc  : 'Hide to user the text input value',
						},
						{
							value : '--default',
							desc  : 'Default value',
						},
					],
					examples : [
						{
							value : '$0 prompt input --default 255 255 0',
							desc  : 'Set color dialog with default color',
						},
					],
				},
			],
		},
	] },
	fn : async ( { argv } ) => {

		const interact = new Interacting(  )
		if ( argv.existsCmd( CMD.DIALOG ) ) {

			const text = argv.getFlagValue( 'desc' )
			if ( text ) {

				const res = await interact.dialog.run( {
					desc          : text,
					cancelButton  : argv.getFlagValue( 'cancel-btn' ),
					defaultButton : argv.getFlagValue( 'default-btn' ),
					extraButton   : argv.getFlagValue( 'extra-btn' ),
					icon          : argv.getFlagValue( 'icon' ) as PromptInputOpt['icon'],
					title         : argv.getFlagValue( 'title' ),
				} )
				console.log( res )

			}
			else console.log( warnStyle( '--desc [text] is required!' ) )

		}
		else if ( argv.existsCmd( CMD.ALERT ) ) {

			const desc = argv.getFlagValue( 'desc' )
			if ( desc ) {

				const res = await interact.alert.run( {
					desc,
					cancelButton  : argv.getFlagValue( 'cancel-btn' ),
					defaultButton : argv.getFlagValue( 'default-btn' ),
					extraButton   : argv.getFlagValue( 'extra-btn' ),
					as            : argv.getFlagValue( 'as' ) as undefined,
				} )
				console.log( res )

			}
			else console.log( warnStyle( '--desc [text] is required!' ) )

		}
		else if ( argv.existsCmd( CMD.NOTFICATION ) ) {

			const desc = argv.getFlagValue( 'desc' )
			if ( desc ) {

				const res = await interact.notification.run( {
					desc,
					title    : argv.getFlagValue( 'title' ),
					subtitle : argv.getFlagValue( 'subtitle' ),
					sound    : argv.getFlagValue( 'sound' ) as NotificationOpts['sound'],
				} )
				console.log( res )

			}
			else console.log( warnStyle( '--desc [text] is required!' ) )

		}
		else if ( argv.existsCmd( CMD.SAY ) ) {

			const desc = argv.getFlagValue( 'desc' )
			if ( desc ) {

				const res = await interact.say.run( desc )
				console.log( res )

			}
			else console.log( warnStyle( '--desc [text] is required!' ) )

		}
		else if ( argv.existsCmd( CMD.PROMPT ) ) {

			if ( argv.existsCmd( CMD.PROMPT_COLOR ) ) {

				const defaultColor = argv.getFlagValues( 'default' )
				const color        = defaultColor ? normalizeArray( defaultColor ) : undefined
				const res          = await interact.prompt.color( { defaultColor: color } )
				console.log( res )

			}
			else if ( argv.existsCmd( CMD.PROMPT_INPUT ) ) {

				const desc =  argv.getFlagValue( 'desc' )
				if ( !desc )  console.log( warnStyle( '--desc [text] is required!' ) )
				else {

					const res = await interact.prompt.input( {
						desc          : desc,
						defaultValue  : argv.getFlagValue( 'default' ),
						hidden        : argv.existsFlag( 'hidden' ),
						cancelButton  : argv.getFlagValue( 'cancel-btn' ),
						defaultButton : argv.getFlagValue( 'default-btn' ),
						extraButton   : argv.getFlagValue( 'extra-btn' ),
						title         : argv.getFlagValue( 'title' ),
						icon          : argv.getFlagValue( 'icon' ) as PromptInputOpt['icon'],
					} )
					console.log( res )

				}

			}
			else if ( argv.existsCmd( CMD.PROMPT_SELECT ) ) {

				const desc  = argv.getFlagValue( 'desc' )
				const items = argv.getFlagValues( 'items' )
				if ( !items ) console.log( warnStyle( '--items [...values] is required!' ) )
				else if ( !desc ) console.log( warnStyle( '--desc [text] is required!' ) )
				else {

					const res = await interact.prompt.select( {
						desc,
						items,
						defaultItems  : argv.getFlagValues( 'default-items' ),
						multiple      : argv.existsFlag( 'multiple' ),
						empty         : argv.existsFlag( 'empty' ),
						cancelButton  : argv.getFlagValue( 'cancel-btn' ),
						defaultButton : argv.getFlagValue( 'default-btn' ),
						title         : argv.getFlagValue( 'title' ),

					} )
					console.log( res )

				}

			}
			else if ( argv.existsCmd( CMD.PROMPT_FILE ) ) {

				const res = await interact.prompt.file( {
					multiple               : argv.existsFlag( 'multiple' ),
					dotfiles               : argv.existsFlag( 'dotfiles' ),
					title                  : argv.getFlagValue( 'title' ),
					defaultLocation        : argv.getFlagValue( 'default-location' ),
					showingPackageContents : argv.existsFlag( 'show-package-contents' ),
					types                  : argv.getFlagValues( 'type' ),
				} )
				console.log( res )

			}
			else if ( argv.existsCmd( CMD.PROMPT_FOLDER ) ) {

				const res = await interact.prompt.folder( {
					multiple               : argv.existsFlag( 'multiple' ),
					dotfiles               : argv.existsFlag( 'dotfiles' ),
					title                  : argv.getFlagValue( 'title' ),
					defaultLocation        : argv.getFlagValue( 'default-location' ),
					showingPackageContents : argv.existsFlag( 'show-package-contents' ),
				} )
				console.log( res )

			}

		}

	},
} )

export default cli

