import { Core }        from './core'
import { Info }        from './info'
import { Power }       from './power'
import { Sleep }       from './sleep'
import { Temperature } from './temperature'

export {
	Info,
	Power,
	Sleep,
	Core,
	Temperature,
}
export class System extends Core {

	sleep       = new Sleep()
	info        = new Info()
	power       = new Power()
	temperature = new Temperature()

}
