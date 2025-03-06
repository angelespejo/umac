import { promptSelect } from './process'

const main = async () => {

	const options  = [
		'Option 1',
		'Option 2',
		'Option 3',
	]
	const selected = await promptSelect( 'Please select an option:', options )

	console.log( `You selected: ${selected}` )

}

main().catch( console.error )
