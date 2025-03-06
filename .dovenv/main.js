import { defineConfig } from '@dovenv/core'
import {
	geMDTocString,
	getObjectFromFile,
	joinPath,
	joinUrl,
	object2string,
	readFile,
	relativePath,
	removeDirIfExist,
	writeFileContent,
} from '@dovenv/core/utils'
import {
	pigeonposseMonorepoTheme,
	Predocs,
	templates,
} from '@dovenv/theme-pigeonposse'

import core from './const.js'

export default defineConfig(
	pigeonposseMonorepoTheme( { core } ),
	{ custom : { predocs : {

		desc : 'Predocs function',
		fn   : async ( { utils } ) => {

			const wsDir   = utils.wsDir
			const repoURL = 'https://github.com/angelespejo/umac'

			await removeDirIfExist( joinPath( wsDir, 'docs', 'guide' ) )

			const pkgs = await utils.getPkgPaths()

			for ( const pkg of pkgs ) {

				let content     = '',
					data        = await getObjectFromFile( pkg )
				const isWs      = data.workspaces ? true : false
				const isPrivate = data.private === true || data.private === 'true' ? true : false
				const pkgDir    = pkg.replace( 'package.json', '' )
				const readmeDir = joinPath( pkgDir, 'README.md' )
				const directory = isWs ? undefined : relativePath( wsDir, pkgDir )
				const homepage  = isWs ? repoURL : joinUrl( repoURL, 'tree/main', directory )
				const docs      = new Predocs( {
					utils,
					opts : { emoji: { umac: '🍎' } },
				} )
				const docsInfo  = await docs.getMarkdownInfo()
				if ( !data.files && !isPrivate ) data.files = [ 'dist' ]
				data = {
					...data,
					homepage,
					bugs : {
						url   : joinUrl( repoURL, 'issues' ),
						email : 'dev@pigeonposse.com',
					},
					repository : {
						type : 'git',
						url  : isWs ? repoURL : joinUrl( repoURL, 'tree/main' ),
						directory,
					},
					funding : {
						type : 'individual',
						url  : 'https://pigeonposse.com/contribute',
					},
					license : 'GPL-3.0',
					author  : {
						name  : 'Angelo',
						email : 'angelo@pigeonposse.com',
						url   : 'https://github.com/angelespejo',
					},
					publishConfig : isPrivate
						? undefined
						: {
							access   : 'public',
							registry : 'https://registry.npmjs.org/',
						},
				}
				await writeFileContent( pkg, object2string( data ) )
				const temp = new templates.Templates( { utils } )

				if ( isWs ) content += ( await readFile( joinPath( utils.config.const.coreDir, 'docs/index.md' ), 'utf-8' ) )
				content += docsInfo.more

				await temp.get( {
					// @see https://github.com/pigeonposse/dovenv/blob/main/packages/theme/pigeonposse/src/docs/data/templates.ts
					input   : docs.template.readmePkg,
					output  : readmeDir,
					partial : {
						footer       : { input: docs.partial.footer },
						content      : { input: content },
						precontent   : { input: joinPath( utils.config.const.coreDir, isWs ? 'docs/ws.md' : 'docs/pre.md' ) },
						installation : { input: docs.partial.installation },
					},
					const : {
						title        : isWs ? data.extra.productName : data.name,
						libPkg       : isWs ? utils.config.const.corePkg : data,
						desc         : data.description,
						info         : docsInfo,
						contributors : '',
						banner       : `[![BANNER]({{const.pkg.repository.url}}/blob/main/docs/public/banner.png?raw=true)]({{const.pkg.homepage}})`,
					},
					hook : { afterPartials : async data => {

						data.const.toc = await geMDTocString( {
							input           : data.content,
							title           : 'Table of contents',
							removeH1        : true,
							maxHeadingLevel : 4,
						} )

						return data

					} },
				} )

			}

		},
	} } },
)
