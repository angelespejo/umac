#!/usr/bin/env node

import cli         from './main'
import { updater } from './up'

const run = async ( ) => {

	await cli.run()
	await updater()

}

run()
