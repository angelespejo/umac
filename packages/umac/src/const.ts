import {
	name,
	description,
	bin,
	version,
	homepage,
} from '../package.json'

export {
	description,
	version,
}

export const BIN_NAME = Object.keys( bin )[0] || name
export const HELP_URL = homepage
