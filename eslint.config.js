import { setConfig } from '@dovenv/theme-pigeonposse/eslint'

export default setConfig( {
	general   : 'ts',
	gitignore : true,
	jsdoc     : true,
	md        : true,
	json      : true,
	package   : true,
	yaml      : true,
	toml      : true,
	ignore    : [
		'**/docs/**/*.md',
		'**/README.md',
		'**/docs/data/**/*.md',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/.dovenv/**/partials/*',
		'**/.dovenv/**/templates/*',
		'**/packages/create/data/**',
		'**/packages/config/**/tests/**',
	],
} )
