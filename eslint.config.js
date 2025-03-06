import { lint } from '@dovenv/theme-pigeonposse'

const { dovenvEslintConfig } = lint

export default [
	dovenvEslintConfig.includeGitIgnore( ),
	...dovenvEslintConfig.config,
	dovenvEslintConfig.setIgnoreConfig( [
		'**/docs/**/*.md',
		'**/README.md',
		'**/docs/data/**/*.md',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/.dovenv/**/partials/*',
		'**/.dovenv/**/templates/*',
		'**/packages/create/data/**',
		'**/packages/config/**/tests/**',
	] ),
]

