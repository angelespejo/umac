import {
	infoStyle,
	UmacCommand,
} from '@umac/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
// import { Desktop } from './core'

// echo "  desk pics remove               Remove Desktop image from a Desktop image list."
// echo "  desk pics remove=imageNames    Remove Desktop image in desktop pictures directory."
// echo "  desk pics change=[path]        Change Desktop image in desktop pictures directory."
// echo "  desk pics change=[path] --sys  Change Desktop images from a directory in system desktop pictures directory."
// echo "  desk pics add=[path]           Add Desktop image in desktop pictures directory."
// echo "  desk pics add=[path] --dir     Add Desktop images from a directory in desktop pictures directory."
// echo "  desk pics add=[path] --sys     Add Desktop images from a directory in system desktop pictures directory."

export const CMD = {
	CHANGE : 'change',
	REMOVE : 'remove',
	ADD    : 'add',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value : CMD.REMOVE,
				desc  : 'Remove Desktop image',
				flags : [
					{
						value : 'id',
						desc  : 'Add name of image to remove it',
					},
				],
			},
			{
				value      : CMD.CHANGE,
				posicional : true,
				desc       : 'Change the Desktop image in the desktop pictures directory.',
			},
			{
				value : CMD.ADD,
				desc  : 'Add a Desktop image to the desktop pictures directory.',
				flags : [
					{
						value : '--dir',
						desc  : 'Add multiple images from a directory.',
					},
				],
			},
		],
		flags : [
			{
				value : '--sys',
				desc  : 'Use the system desktop pictures directory.',
			},
		],
	},
	fn : async (  ) => {

		// const desk = new Desktop()
		console.log( infoStyle( `Currently in development` ) )

	},
} )

export default cli
export { cli }
