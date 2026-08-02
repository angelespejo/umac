
import { config }            from '@umac-js/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( {
	...config,
	failOnWarn : false,
} )
