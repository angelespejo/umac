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

/**
 * Reads the content of a file specified by path segments.
 *
 * @param   {...string}       v - The path segments to the target file (e.g., 'folder', 'subfolder', 'file.txt').
 * @returns {Promise<string>}   A promise that resolves to the UTF-8 content of the file.
 */
const readPath = ( ...v ) => readFile( joinPath( ...v ), 'utf-8' )

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		predocs : async ( { utils } ) => {

			const wsDir   = utils.wsDir
			const wsPkg   = utils.pkg
			const repoURL = wsPkg.repository.url

			if ( !repoURL ) throw new Error( `Repository url (wsPkg.repository.url) does not eists in ${wsDir}` )

			await removeDirIfExist( joinPath( wsDir, 'docs', 'guide' ) )

			const docs = new Predocs( {
				utils,
				opts : { emoji: { umac: '🍎' } },
			} )

			const docsInfo = await docs.getMarkdownInfo()
			docsInfo.more  = docsInfo.more.replaceAll( 'guide', 'packages' )
			const temp     = new templates.Templates( { utils } )

			const pkgs = await utils.getPkgPaths()

			for ( const pkg of pkgs ) {

				let content = '',
					/** @type {import('@dovenv/core/utils').PackageJSON} */
					data        = await getObjectFromFile( pkg )

				const isWs      = data.workspaces ? true : false
				const isPrivate = data.private === true || data.private === 'true' ? true : false
				const pkgDir    = pkg.replace( 'package.json', '' )
				const readmeDir = joinPath( pkgDir, 'README.md' )
				const isCore    = data.name === 'umac'
				const directory = isWs ? undefined : relativePath( wsDir, pkgDir )
				const homepage  = isWs ? repoURL : joinUrl( repoURL, 'tree/main', directory )
				if ( !data.files && !isPrivate ) data.files = [ 'dist' ]
				data = {
					...data,
					homepage,
					bugs       : wsPkg.bugs,
					repository : {
						type : 'git',
						url  : isWs ? repoURL : joinUrl( repoURL, 'tree/main' ),
						directory,
					},
					funding       : wsPkg.funding,
					license       : wsPkg.license,
					author        : wsPkg.author,
					publishConfig : isPrivate
						? undefined
						: {
							access   : 'public',
							registry : 'https://registry.npmjs.org/',
						},
				}
				await writeFileContent( pkg, object2string( data ) )

				if ( isWs || isCore ) content += ( await readPath( utils.config.const.coreDir, 'docs/index.md' ) )
				content += docsInfo.more

				await temp.get( {
					// @see https://github.com/pigeonposse/dovenv/blob/main/packages/theme/pigeonposse/src/docs/data/templates.ts
					input   : docs.template.readmePkg,
					output  : readmeDir,
					partial : {
						footer       : { input: docs.partial.footer },
						content      : { input: content },
						precontent   : { input: await readPath( utils.config.const.coreDir, isWs ? 'docs/ws.md' : 'docs/pre.md' ) },
						installation : { input: docs.partial.installation },
					},
					const : {
						title        : isWs ? data.extra.productName : data.name,
						libPkg       : isWs ? utils.config.const.corePkg : data,
						desc         : data.description,
						info         : docsInfo,
						contributors : '',
						banner       : `[![BANNER]({{const.REPO_URL}}/blob/main/docs/public/banner.png?raw=true)]({{const.pkg.homepage}})`,
						libPkgBadges : '',
					},
					hook : {
						afterPartials : async data => {

							data.const.toc = await geMDTocString( {
								input           : data.content,
								title           : 'Table of contents',
								removeH1        : true,
								maxHeadingLevel : 4,
							} )

							return data

						},
					},
				} )

			}

		},
	} ),
	// {
	// 	custom : {
	// 		predocs : {

	// 			desc : 'Predocs function',
	// 			fn   : async ( { utils } ) => {

	// 				const wsDir   = utils.wsDir
	// 				const wsPkg   = utils.pkg
	// 				const repoURL = wsPkg.repository.url

	// 				if ( !repoURL ) throw new Error( `Repository url (wsPkg.repository.url) does not eists in ${wsDir}` )

	// 				await removeDirIfExist( joinPath( wsDir, 'docs', 'guide' ) )

	// 				const docs = new Predocs( {
	// 					utils,
	// 					opts : { emoji: { umac: '🍎' } },
	// 				} )

	// 				const docsInfo = await docs.getMarkdownInfo()
	// 				docsInfo.more  = docsInfo.more.replaceAll( 'guide', 'packages' )
	// 				const temp     = new templates.Templates( { utils } )

	// 				const pkgs = await utils.getPkgPaths()

	// 				for ( const pkg of pkgs ) {

	// 					let content = '',
	// 						/** @type {import('@dovenv/core/utils').PackageJSON} */
	// 						data        = await getObjectFromFile( pkg )

	// 					const isWs      = data.workspaces ? true : false
	// 					const isPrivate = data.private === true || data.private === 'true' ? true : false
	// 					const pkgDir    = pkg.replace( 'package.json', '' )
	// 					const readmeDir = joinPath( pkgDir, 'README.md' )
	// 					const isCore    = data.name === 'umac'
	// 					const directory = isWs ? undefined : relativePath( wsDir, pkgDir )
	// 					const homepage  = isWs ? repoURL : joinUrl( repoURL, 'tree/main', directory )
	// 					if ( !data.files && !isPrivate ) data.files = [ 'dist' ]
	// 					data = {
	// 						...data,
	// 						homepage,
	// 						bugs       : wsPkg.bugs,
	// 						repository : {
	// 							type : 'git',
	// 							url  : isWs ? repoURL : joinUrl( repoURL, 'tree/main' ),
	// 							directory,
	// 						},
	// 						funding       : wsPkg.funding,
	// 						license       : wsPkg.license,
	// 						author        : wsPkg.author,
	// 						publishConfig : isPrivate
	// 							? undefined
	// 							: {
	// 								access   : 'public',
	// 								registry : 'https://registry.npmjs.org/',
	// 							},
	// 					}
	// 					await writeFileContent( pkg, object2string( data ) )

	// 					if ( isWs || isCore ) content += ( await readPath( utils.config.const.coreDir, 'docs/index.md' ) )
	// 					content += docsInfo.more

	// 					await temp.get( {
	// 						// @see https://github.com/pigeonposse/dovenv/blob/main/packages/theme/pigeonposse/src/docs/data/templates.ts
	// 						input   : docs.template.readmePkg,
	// 						output  : readmeDir,
	// 						partial : {
	// 							footer       : { input: docs.partial.footer },
	// 							content      : { input: content },
	// 							precontent   : { input: await readPath( utils.config.const.coreDir, isWs ? 'docs/ws.md' : 'docs/pre.md' ) },
	// 							installation : { input: docs.partial.installation },
	// 						},
	// 						const : {
	// 							title        : isWs ? data.extra.productName : data.name,
	// 							libPkg       : isWs ? utils.config.const.corePkg : data,
	// 							desc         : data.description,
	// 							info         : docsInfo,
	// 							contributors : '',
	// 							banner       : `[![BANNER]({{const.REPO_URL}}/blob/main/docs/public/banner.png?raw=true)]({{const.pkg.homepage}})`,
	// 							libPkgBadges : '',
	// 						},
	// 						hook : {
	// 							afterPartials : async data => {

	// 								data.const.toc = await geMDTocString( {
	// 									input           : data.content,
	// 									title           : 'Table of contents',
	// 									removeH1        : true,
	// 									maxHeadingLevel : 4,
	// 								} )

	// 								return data

	// 							},
	// 						},
	// 					} )

	// 				}

	// 			},
	// 		},
	// 	},
	// },
)
