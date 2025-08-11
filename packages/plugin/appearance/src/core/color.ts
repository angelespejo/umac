import { exec } from '@umac-js/utils'

export const COLOR_ID = {
	RED      : 'red',
	ORANGE   : 'orange',
	YELLOW   : 'yellow',
	GREEN    : 'green',
	BLUE     : 'blue',
	PURPLE   : 'purple',
	PINK     : 'pink',
	GRAY     : 'graphite',
	MULTIPLE : 'multiple',
} as const
export type ColorId = typeof COLOR_ID[keyof typeof COLOR_ID]
const COLOR_ACCENT_CODE = {
	[-1] : COLOR_ID.GRAY,
	[0]  : COLOR_ID.RED,
	[1]  : COLOR_ID.ORANGE,
	[2]  : COLOR_ID.YELLOW,
	[3]  : COLOR_ID.GREEN,
	[4]  : COLOR_ID.BLUE,
	[5]  : COLOR_ID.PURPLE,
	[6]  : COLOR_ID.PINK,
} as const satisfies { [k in number]: ColorId }

const COLOR_HIGHLIGHT_CODE = {
	'1.000000 0.733333 0.721569 Red'      : COLOR_ID.RED,
	'1.000000 0.874510 0.701961 Orange'   : COLOR_ID.ORANGE,
	'1.000000 0.937255 0.690196 Yellow'   : COLOR_ID.YELLOW,
	'0.752941 0.964706 0.678431 Green'    : COLOR_ID.GREEN,
	'0.698039 0.843137 1.000000 Blue'     : COLOR_ID.BLUE,
	'0.968627 0.831373 1.000000 Purple'   : COLOR_ID.PURPLE,
	'1.000000 0.749020 0.823529 Pink'     : COLOR_ID.PINK,
	'0.847059 0.847059 0.862745 Graphite' : COLOR_ID.GRAY,
} as const satisfies { [k in string | number]: ColorId }

export class Color {

	COLOR_ID = COLOR_ID
	async getAccentCode() {

		try {

			const {
				stdout, stderr,
			} = await exec( 'defaults read -g AppleAccentColor' )

			if ( stderr ) return undefined
			return parseInt( stdout.toString().trim() )

		}
		catch ( _e ) {

			return undefined

		}

	}

	async getHighlightCode() {

		try {

			const {
				stdout, stderr,
			} = await exec( 'defaults read -g AppleHighlightColor' )

			if ( stderr ) return undefined
			return stdout.toString().trim()

		}
		catch ( _e ) {

			return undefined

		}

	}

	getAccentCodeFrom( value: ColorId ): number | undefined {

		return Object.keys( COLOR_ACCENT_CODE ).find(
			key => COLOR_ACCENT_CODE[Number( key ) as keyof typeof COLOR_ACCENT_CODE] === value,
		) as number | undefined

	}

	getHighlightCodeFrom( value: ColorId ): number | undefined {

		return Object.keys( COLOR_HIGHLIGHT_CODE ).find(
			key => COLOR_HIGHLIGHT_CODE[key as keyof typeof COLOR_HIGHLIGHT_CODE] === value,
		) as number | undefined

	}

	async getAccent() {

		const num = await this.getAccentCode()
		console.debug( { accentCode: num } )
		return COLOR_ACCENT_CODE[num as keyof typeof COLOR_ACCENT_CODE] || COLOR_ID.MULTIPLE

	}

	async getHighlight() {

		const num = await this.getHighlightCode()
		console.debug( { highlightCode: num } )
		return COLOR_HIGHLIGHT_CODE[num as keyof typeof COLOR_HIGHLIGHT_CODE] || COLOR_ID.MULTIPLE

	}

	async setAccentColor( color: Exclude<ColorId, 'multiple'> ) {

		const code = this.getAccentCodeFrom( color )
		if ( !code ) return
		return await exec( `defaults write -g AppleAccentColor -string ${code}` )

	}

	async setHighlightColor( color: Exclude<ColorId, 'multiple'> ) {

		const code = this.getHighlightCodeFrom( color )
		if ( !code ) return
		return await exec( `defaults write -g AppleHighlightColor -string ${code} ` )

	}

}
