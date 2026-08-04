import type {
	InspectColorBackground, InspectColorForeground, InspectColorModifier,
} from 'node:util'

export type StyleForegroundColor = InspectColorForeground
export type StyleBackgroundColor = InspectColorBackground
export type StyleModifier = InspectColorModifier

export const STYLE_FOREGROUND_COLOR = {
	black         : 'black',
	red           : 'red',
	green         : 'green',
	yellow        : 'yellow',
	blue          : 'blue',
	magenta       : 'magenta',
	cyan          : 'cyan',
	white         : 'white',
	gray          : 'gray',
	// blackBright   : 'blackBright',
	redBright     : 'redBright',
	greenBright   : 'greenBright',
	yellowBright  : 'yellowBright',
	blueBright    : 'blueBright',
	magentaBright : 'magentaBright',
	cyanBright    : 'cyanBright',
	whiteBright   : 'whiteBright',
} satisfies Record<InspectColorForeground, InspectColorForeground>

export const STYLE_BACKGROUND_COLOR = {
	bgBlack         : 'bgBlack',
	// bgBlackBright   : 'bgBlackBright',
	bgBlue          : 'bgBlue',
	bgBlueBright    : 'bgBlueBright',
	bgCyan          : 'bgCyan',
	bgCyanBright    : 'bgCyanBright',
	bgGray          : 'bgGray',
	bgGreen         : 'bgGreen',
	bgGreenBright   : 'bgGreenBright',
	// bgGrey          : 'bgGrey',
	bgMagenta       : 'bgMagenta',
	bgMagentaBright : 'bgMagentaBright',
	bgRed           : 'bgRed',
	bgRedBright     : 'bgRedBright',
	bgWhite         : 'bgWhite',
	bgWhiteBright   : 'bgWhiteBright',
	bgYellow        : 'bgYellow',
	bgYellowBright  : 'bgYellowBright',
} satisfies Record<InspectColorBackground, InspectColorBackground>

export const STYLE_MODIFIER = {
	blink           : 'blink',
	bold            : 'bold',
	dim             : 'dim',
	doubleunderline : 'doubleunderline',
	// framed          : 'framed',
	hidden          : 'hidden',
	inverse         : 'inverse',
	italic          : 'italic',
	// overlined       : 'overlined',
	reset           : 'reset',
	strikethrough   : 'strikethrough',
	underline       : 'underline',
} satisfies Record<InspectColorModifier, InspectColorModifier>
