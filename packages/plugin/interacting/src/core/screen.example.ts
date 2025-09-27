import os       from 'node:os'
import { join } from 'node:path'

import { Screen } from './screen'

const homePath = os.homedir()
const screen   = new Screen()

/**
 * SCREENSHOT
 */

// await screen.capture( join( homePath, 'Desktop/fullscreen.png' ), { includeCursor: false } )
// await screen.capture( join( homePath, './Desktop/region.png' ), { mode : [
// 	100,
// 	100,
// 	400,
// 	300,
// ] } )
// await screen.capture( join( homePath, './Desktop/window.png' ), {
// 	includeCursor : true,
// 	shadow        : false,
// 	silent        : true,
// 	mode       : 'window',
// } )

// await screen.capture( join( homePath, './Desktop/interactive.png' ), {
// 	includeCursor : true,
// 	shadow        : false,
// 	silent        : true,
// 	mode          : 'interactive',
// 	delay         : 0,
// 	showUI        : true,
// 	// preview       : true,
// } )

/**
 * VIDEO
 */

// await screen.record( join( homePath, './Desktop/fullscreen.mov' ) )
// await screen.record( join( homePath, './Desktop/fullscreen.mov' ), { showClicks: true } )
await screen.record(
	join( homePath, './Desktop/window.mov' ),
	{
		audio         : false,
		showClicks    : true,
		videoDuration : 10,
		mode          : [
			100,
			100,
			400,
			300,
		],
	},
)
