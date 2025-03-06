
/** @type {import('unbuild').BuildConfig} */
export const config = {
	sourcemap   : false,
	declaration : true,
	rollup      : { esbuild : {
		minify : true,
		target : 'node20',
	} },
	failOnWarn : true,
}
