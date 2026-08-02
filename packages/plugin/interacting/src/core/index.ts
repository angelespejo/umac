import { Alert }        from './alert'
import { Clipboard }    from './clipboard'
import { Dialog }       from './dialog'
import { Keyboard }     from './keyboard'
import { Notification } from './notification'
import { Prompt }       from './prompt'
import { Say }          from './say'
import { Screen }       from './screen'
import { Siri }         from './siri'

export class Interacting {

	notification = new Notification()
	dialog = new Dialog()
	alert = new Alert()
	say = new Say()
	prompt = new Prompt()
	keyboard = new Keyboard()
	screen = new Screen()
	siri = new Siri()
	clipboard = new Clipboard()

}

