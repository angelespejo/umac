import { Core }  from './core'
import { Info }  from './info'
import { Sleep } from './sleep'

export {
	Info,
	Sleep,
	Core,
}
export class System extends Core {

	sleep = new Sleep()
	info = new Info()

}
