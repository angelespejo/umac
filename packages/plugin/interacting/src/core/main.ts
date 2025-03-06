import { Alert }        from './alert'
import { Dialog }       from './dialog'
import { Notification } from './notification'
import { Prompt }       from './prompt'
import { Say }          from './say'

export class Interacting {

	notification  = new Notification()
	dialog = new Dialog()
	alert = new Alert()
	say = new Say()
	prompt = new Prompt()

}

