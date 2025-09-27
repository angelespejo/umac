import { Siri } from './siri'

const siri = new Siri()

const run = async () => {

	await siri.open()
	await siri.speakText( 'Hola Siri! Que tiempo hace hoy?' )

}

run()

