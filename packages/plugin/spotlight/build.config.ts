
import { config }            from '@umac/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( {
	...config,
	failOnWarn : false,
} )
