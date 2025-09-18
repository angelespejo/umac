/**
 * ESLint config.
 *
 * @description ESLint config for JavaScript and TypeScript projects.
 * @see https://eslint.org/docs
 * @see https://typescript-eslint.io/
 */
import { setConfig }    from '@dovenv/theme-pigeonposse/eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(
	setConfig( {
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
	} ),
)
