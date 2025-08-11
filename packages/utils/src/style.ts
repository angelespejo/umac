import { styleText } from 'node:util'

import {
	STYLE_FOREGROUND_COLOR,
	STYLE_MODIFIER,
	StyleBackgroundColor,
	StyleForegroundColor,
	StyleModifier,
} from './style-props'

export const color = Object.fromEntries(
	[
		...Object.entries( STYLE_FOREGROUND_COLOR ),
		...Object.entries( STYLE_FOREGROUND_COLOR ),
		...Object.entries( STYLE_MODIFIER ),
	]
		.map( ( [ key, value ] ) => [ key, ( v: string ) => styleText( value, v ) ] ),
) as Record<StyleModifier | StyleBackgroundColor | StyleForegroundColor, ( v: string ) => string>

export const bold = ( v:string ) => color.bold( v )
export const dim = ( v: string ) => color.dim( v )
export const inverse = ( v: string ) => color.inverse( v )
export const italic = ( v: string ) => color.italic( v )
export const underline = ( v: string ) => color.underline( v )

export const helpStyle = {
	desc          : ( v: string ) => dim( v ),
	url           : ( v: string ) => color.magenta( italic( underline( v ) ) ),
	title         : ( v: string ) => bold( inverse( ' ' + v + ' ' ) ),
	sectionTitle  : ( v: string ) => bold( v ),
	example       : ( v: string ) => color.cyan( v ),
	cmd           : ( v: string ) => color.green( v ),
	cmdPositional : ( v: string ) => color.green( dim( `<${v}>` ) ),
	flag          : ( v: string ) => color.yellow( v ),
	bin           : ( v: string ) => color.cyan( v ),
}

type Msg = string | [string, string]

export const ICON = {
	SUCCESS  : '✔️',
	ERROR    : 'ｘ',
	WARN     : '⚠️',
	INFO     : 'ℹ',
	LI       : '•',
	ARROW    : '→',
	STAR     : '★',
	CHECKBOX : '☑',
}

export const customStyle = ( i:string, v: Msg ) => v instanceof Array
	? `${bold( i )} ${bold( v[0] )} ${dim( v[1] )}`
	: `${bold( i )} ${dim( v )}`

export const successStyle = ( v:Msg ) => color.green( customStyle( ICON.SUCCESS, v ) )
export const errorStyle = ( v:Msg ) => color.red( customStyle( ICON.ERROR, v ) )
export const warnStyle = ( v:Msg ) => color.yellow( customStyle( ICON.WARN, v ) )
export const infoStyle = ( v:Msg ) => customStyle( ICON.INFO, v )
export const liStyle = ( v:Msg ) => customStyle( ICON.LI, v )

