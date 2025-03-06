export type StyleForegroundColor =
	| 'black' | 'blackBright' | 'blue' | 'blueBright' | 'cyan' | 'cyanBright'
	| 'gray' | 'green' | 'greenBright' | 'grey' | 'magenta' | 'magentaBright'
	| 'red' | 'redBright' | 'white' | 'whiteBright' | 'yellow' | 'yellowBright'

export type StyleBackgroundColor =
	| 'bgBlack' | 'bgBlackBright' | 'bgBlue' | 'bgBlueBright' | 'bgCyan'
	| 'bgCyanBright' | 'bgGray' | 'bgGreen' | 'bgGreenBright' | 'bgGrey'
	| 'bgMagenta' | 'bgMagentaBright' | 'bgRed' | 'bgRedBright' | 'bgWhite'
	| 'bgWhiteBright' | 'bgYellow' | 'bgYellowBright'

export type StyleModifier =
	| 'blink' | 'bold' | 'dim' | 'doubleunderline' | 'framed' | 'hidden'
	| 'inverse' | 'italic' | 'overlined' | 'reset' | 'strikethrough' | 'underline'

export const  STYLE_FOREGROUND_COLOR = {
	black         : 'black',
	red           : 'red',
	green         : 'green',
	yellow        : 'yellow',
	blue          : 'blue',
	magenta       : 'magenta',
	cyan          : 'cyan',
	white         : 'white',
	blackBright   : 'blackBright',
	redBright     : 'redBright',
	greenBright   : 'greenBright',
	yellowBright  : 'yellowBright',
	blueBright    : 'blueBright',
	magentaBright : 'magentaBright',
	cyanBright    : 'cyanBright',
	whiteBright   : 'whiteBright',
} as const

export const STYLE_BACKGROUND_COLOR = {
	bgBlack         : 'bgBlack',
	bgBlackBright   : 'bgBlackBright',
	bgBlue          : 'bgBlue',
	bgBlueBright    : 'bgBlueBright',
	bgCyan          : 'bgCyan',
	bgCyanBright    : 'bgCyanBright',
	bgGray          : 'bgGray',
	bgGreen         : 'bgGreen',
	bgGreenBright   : 'bgGreenBright',
	bgGrey          : 'bgGrey',
	bgMagenta       : 'bgMagenta',
	bgMagentaBright : 'bgMagentaBright',
	bgRed           : 'bgRed',
	bgRedBright     : 'bgRedBright',
	bgWhite         : 'bgWhite',
	bgWhiteBright   : 'bgWhiteBright',
	bgYellow        : 'bgYellow',
	bgYellowBright  : 'bgYellowBright',
} as const

export const STYLE_MODIFIER = {
	blink           : 'blink',
	bold            : 'bold',
	dim             : 'dim',
	doubleunderline : 'doubleunderline',
	framed          : 'framed',
	hidden          : 'hidden',
	inverse         : 'inverse',
	italic          : 'italic',
	overlined       : 'overlined',
	reset           : 'reset',
	strikethrough   : 'strikethrough',
	underline       : 'underline',
} as const
