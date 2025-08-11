import { Argv } from './argv'

const argv = new Argv( [
	'command',
	'1',
	'2',
	'--color',
	'225',
	'0',
] )
console.log( )
console.log( {
	cmd  : argv.getCmdValues( 'command' ),
	flag : argv.getFlagValues( 'color' ),
} )
