import { Keyboard } from './keyboard'

const keyboard = new Keyboard()
await keyboard.write( 'Hello world' )
await keyboard.press( [ 'SPACE', 'COMMAND' ] )
await keyboard.press( 'F2' ) // mute
// keyboard.press( 'F11' ) // volume down
// keyboard.press( 'F12' ) // volume up

