// import {
// 	globby,
// 	globbyStream,
// } from 'globby'
import { createWriteStream } from 'node:fs'
import {
	stat,
	writeFile as nodeWriteFile,
	access,
	constants,
	readFile as nodeReadFile,
	mkdir,
	symlink,
	lstat,
	readdir,
	unlink,
	copyFile as nodeCopyFile,
	rm,
} from 'node:fs/promises'
import { homedir } from 'node:os'
import {
	join,
	resolve,
	extname,
	dirname,
	basename,
	relative,
	isAbsolute,
	normalize,
} from 'node:path'
import { fileURLToPath } from 'node:url'

export const PATH = {
	CACHE_DIR            : `${homedir()}/Library/Caches`,
	SERVICES_DIR         : `${homedir()}/Library/Services`,
	DOCUMENTS_DIR        : `${homedir()}/Documents`,
	DOWNLOADS_DIR        : `${homedir()}/Downloads`,
	DESKTOP_DIR          : `${homedir()}/Desktop`,
	MUSIC_DIR            : `${homedir()}/Music`,
	PICTURES_DIR         : `${homedir()}/Pictures`,
	MOVIES_DIR           : `${homedir()}/Movies`,
	DESK_PICS_DIR        : '/Library/Desktop Pictures',
	SYS_DESK_PICS_DIR    : '/System/Library/Desktop Pictures',
	APPLICATIONS_DIR     : '/Applications',
	SYS_APPLICATIONS_DIR : '/System/Applications',
} as const

export const resolvePath = resolve
export const relativePath = relative
export const getExtName = extname
export const getDirName = dirname
export const getBaseName = basename
export const isAbsolutePath = isAbsolute
export const normalizePath = normalize

export {
	createWriteStream,
	fileURLToPath,
}

export const writeFile = nodeWriteFile

// /**
//  * Find files and directories using glob patterns.
//  * @example const paths = await getPaths(['*', '!src']);
//  * console.log(paths);
//  * //=> ['pigeon', 'rainbow']
//  */
// export const getPaths = globby

// /**
//  * Find files and directories using glob patterns.
//  * @example
//  * for await (const path of getPathsStream('*.tmp')) {
//  *    console.log(paths);
//  * }
//  */
// export const getPathsStream = globbyStream

/**
 * Checks if two file paths are equal after normalization.
 * Normalization ensures that differences like trailing slashes or redundant path segments are ignored.
 *
 * ---
 *
 * @param   {string}  path1 - The first file path to compare.
 * @param   {string}  path2 - The second file path to compare.
 * @returns {boolean}       `true` if the paths are equal, `false` otherwise.
 */
export const arePathsEqual = ( path1: string, path2: string ): boolean => {

	const normalizedPath1 = resolvePath( path1 )
	const normalizedPath2 = resolvePath( path2 )

	return normalizedPath1 === normalizedPath2

}

/**
 * Check if a string is a valid path.
 *
 * @param   {string}  str - The string to test.
 * @returns {boolean}     True if the string is a valid path.
 * @example
 * isPath('..') // true
 * isPath('foo bar') // false
 * isPath('C:\\') // true
 * isPath('foo\\bar') // true
 * isPath('foo/bar') // true
 * isPath('foo bar/baz') // false
 */
export const isPath = ( str: string ) => {

	if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

		if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

			if ( /\s(?!\\)/.test( str ) && !/\\\s/.test( str ) )
				return false

			try {

				const normalizedPath = join( str )
				return normalizedPath !== ''

			}
			catch {

				return false

			}

		}

	}
	return false

}

/**
 * Creates a directory if it does not exist.
 *
 * @param   {string}        path - Path to the directory to create.
 * @returns {Promise<void>}      - A promise that resolves when the directory has been created.
 * @example
 * await ensureDir('./path/to/directory')
 */
export const ensureDir = async ( path: string ) => {

	const exist = await existsDir( path )
	if ( !exist ) await createDir( path )

}

/**
 * Reads the contents of a directory.
 *
 * @param   {string}                              path - Path to the directory to read.
 * @returns {Promise<import('node:fs').Dirent[]>}      - A promise that resolves to an array of {@link https://nodejs.org/api/fs.html#class-fs-dirent | fs.Dirent} objects.
 * @example
 * const dirItems = await readDir('./path/to/directory')
 */
export const readDir = async ( path: string ) => {

	path = validateHomeDir( path )
	return await readdir( path, { withFileTypes: true } )

}

/**
 * Gets the file names in a directory and filters them by extension.
 *
 * @param   {object}            props            - Function props.
 * @param   {string}            props.path       - Path to the directory.
 * @param   {string[]}          props.extensions - Array of extensions to filter by, e.g., ['.md', '.txt'].
 * @returns {Promise<string[]>}                  - A promise that resolves with an array of file names without extensions.
 */
export async function getFilteredFileNames( {
	path, extensions = [],
}: {
	path       : string
	extensions : string[]
} ) {

	const files = await readDir( path )

	const filteredFileNames = files.filter( file => {

		const ext = getExtName( file.name )
		return extensions.includes( ext )

	} ).map( file => getBaseName( file.name, getExtName( file.name ) ) )

	return filteredFileNames

}

/**
 * Gets the current directory.
 *
 * @param   {string} [path] - An optional path to resolve the directory from.
 * @returns {string}        - The current directory.
 * @example getCurrentDir()
 */
export const getCurrentDir = ( path = import.meta.url ) =>
	getDirName( fileURLToPath( path ) )

/**
 * Joins path segments.
 *
 * @param   {...string} paths - Path segments to join.
 * @returns {string}          - The joined path.
 * @example joinPath('user', 'pigeonposse')
 */
export function joinPath( ...paths: string[] ): string {

	return join( ...paths )

}

/**
 * Resolves path segments into an absolute path.
 *
 * @param   {...string} paths - Path segments to resolve.
 * @returns {string}          - The resolved absolute path.
 */
export const getAbsolutePath = resolve

/**
 * Validates and resolves a path with home directory replacement.
 *
 * @param   {string} path - The path to validate and resolve.
 * @returns {string}      - The validated and resolved absolute path.
 * @example
 * import { validateHomeDir } from '@dovenv/utils'
 *
 * const path = validateHomeDir('~/Documents')
 *
 * console.log(path) // returns: /users/{username}/Documents
 *
 * const path = validateHomeDir('/Home')
 *
 * console.log(path) // returns same: /Home
 */
export function validateHomeDir( path: string ): string {

	let resolvedPath: string = path
	if ( path.startsWith( '~/' ) ) {

		resolvedPath = path.replace( /^~(?=$|\/|\\)/, homedir() )

	}
	return getAbsolutePath( resolvedPath )

}

/**
 * Reads the content of a file at the specified path.
 *
 * @param   {string}                   path - The path of the file to read.
 * @returns {Promise<string | Buffer>}      - A promise that resolves to the content of the file as a string or buffer.
 * @throws {Error} If an error occurs while reading the file.
 * @example import { readFile } from '@dovenv/utils'
 *
 * try {
 *   const content = await readFile('./example.txt');
 *   console.log(content);
 * } catch (error) {
 *   console.error('Error reading file:', error);
 * }
 */
export const readFile = nodeReadFile

/**
 * Removes a directory and its contents if it exists.
 *
 * @param {string} path - The path of the directory to remove.
 * @throws {Error} If an error occurs while removing the directory.
 * @example import { removeDir } from '@dovenv/utils'
 *
 * try {
 *   await removeDir('./my/path')
 * } catch (e) {
 *   console.log(e)
 * }
 */
export async function removeDir( path: string ): Promise<void> {

	try {

		path = validateHomeDir( path )
		await rm( path, {
			recursive : true,
			force     : true,
		} )

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error removing ${path}: ${error.message}` )

	}

}

/**
 * Removes a directory and its contents if it exists.
 *
 * @param {string} path - The path of the directory to remove.
 * @throws {Error} If an error occurs while removing the directory.
 * @example import { removeDirIfExist } from '@dovenv/utils'
 *
 * await removeDirIfExist('./my/path')
 */
export async function removeDirIfExist( path: string ): Promise<void> {

	path         = validateHomeDir( path )
	const exists = await existsDir( path )
	if ( exists ) await removeDir( path )

}

/**
 * Removes a file or directory if it exists.
 *
 * @param {string} path - The path of the file or directory to remove.
 * @throws {Error} If an error occurs while removing the file or directory.
 * @example
 * try {
 *   await removePathIfExist('./my/path')
 * } catch (e) {
 *   console.log(e)
 * }
 */
export async function removePathIfExist( path: string ): Promise<void> {

	path        = validateHomeDir( path )
	const isDir = await isDirectory( path )
	if ( isDir ) await removeDirIfExist( path )
	else await removeFileIfExist( path )

}

/**
 * Removes a file if it exists.
 *
 * @param {string} path - The path of the file to remove.
 * @throws {Error} If an error occurs while removing the file.
 * @example
 * try {
 *   await removeFile('./my/path')
 * } catch (e) {
 *   console.log(e)
 * }
 */
export async function removeFileIfExist( path: string ): Promise<void> {

	path         = validateHomeDir( path )
	const exists = await existsFile( path )
	if ( exists ) await unlink( path )

}

/**
 * Removes a file.
 *
 * @param {string} path - The path of the file to remove.
 * @throws {Error} If an error occurs while removing the file.
 * @example
 * try {
 *   await removeFile('./my/path')
 * } catch (e) {
 *   console.log(e)
 * }
 */
export async function removeFile( path: string ): Promise<void> {

	await unlink( path )

}

/**
 * Checks if the given path points to a directory.
 *
 * @param   {string}           path - The path to check.
 * @returns {Promise<boolean>}      - A promise that resolves to true if the path points to a directory, otherwise false.
 * @example import { isDirectory } from '@dovenv/utils'
 *
 * const isDir = await isDirectory('./my/path')
 */
export async function isDirectory( path: string ): Promise<boolean> {

	path        = validateHomeDir( path )
	const stats = await stat( path )
	return stats.isDirectory()

}

/**
 * Creates a directory at the specified path.
 *
 * @param {string} path - The path of the directory to create.
 * @throws {Error} If an error occurs while creating the directory.
 * @example import { createDir } from '@dovenv/utils'
 * await createDir('./my/dir')
 */
export async function createDir( path: string ): Promise<void> {

	try {

		path = validateHomeDir( path )
		await mkdir( path, { recursive: true } )

	}
	catch ( error ) {

		throw Error( `Error creating the directory: ${error}` )

	}

}

/**
 * Checks if a directory exists at the specified path.
 *
 * @param   {string}           path - The path to check.
 * @returns {Promise<boolean>}      - A promise that resolves to true if a directory exists at the specified path, otherwise false.
 * @example import { existsDir } from '@dovenv/utils'
 * const exist = await existsDir('./my/dir')
 */
export async function existsDir( path: string ): Promise<boolean> {

	try {

		path = validateHomeDir( path )
		await access( path, constants.F_OK )
		const stats = await stat( path )
		return stats.isDirectory() // Returns true if it is a directory

	}
	catch ( _error ) {

		return false

	}

}

/**
 * Checks if a file exists at the specified path.
 *
 * @param   {string}           path - The path to the file.
 * @returns {Promise<boolean>}      - A promise that resolves to true if the file exists, otherwise false.
 * @throws {Error} If an error occurs while checking the existence of the file.
 * @example import { existsFile } from '@dovenv/utils'
 *
 * const existPKG = await existsFile('./package.json')
 */
export async function existsFile( path: string ): Promise<boolean> {

	try {

		path = validateHomeDir( path )
		await access( path )
		const stats = await stat( path )
		return stats.isFile()

	}
	catch ( _error ) {

		return false

	}

}

/**
 * Writes content to a file at the specified path.
 *
 * @param {string}          path    - The path of the file to write to.
 * @param {string | Buffer} content - The content to write to the file.
 * @throws {Error} If an error occurs while writing to the file.
 * @example import { writeFileContent } from '@dovenv/utils'
 *
 * await writeFileContent('./greetFile.txt', 'Hello')
 */
export async function writeFileContent( path: string, content: string | Buffer ): Promise<void> {

	path = validateHomeDir( path )
	await nodeWriteFile( path, content )

}

/**
 * Checks if a file or directory exists at the specified path.
 *
 * @param   {string}           path - The path to check.
 * @returns {Promise<boolean>}      - A promise that resolves to true if a file or directory exists at the specified path, otherwise false.
 * @throws {Error} If an error occurs while checking the existence of the path.
 * @example import { existsPath } from '@dovenv/utils'
 *
 * const existPKG = await existsPath('./package.json')
 */
export async function existsPath( path: string ): Promise<boolean> {

	const isFile = await existsFile( path )
	if ( isFile ) return true
	const isDir = await existsDir( path )
	return isDir

}

/**
 * Copy a file from input path to output path.
 *
 * @param   {{input: string, output: string}} options - Options object with input and output paths.
 * @returns {Promise<void>}                           - Resolves when the file has been copied.
 * @throws {Error} If there is an error copying the file.
 * @example import { copyFile } from '@dovenv/utils'
 *
 * const copyResult = await copyFile({
 *   input : '/path/to/source.txt',
 *   output: '/path/to/destination.txt',
 * })
 */
export const copyFile = async ( {
	input, output,
}: {
	input  : string
	output : string
} ) => {

	await nodeCopyFile( input, output )

}

/**
 * Copy a directory from input path to output path.
 *
 * @param   {{input: string, output: string}} options - Options object with input and output paths.
 * @returns {Promise<void>}                           - Resolves when the directory has been copied.
 * @throws {Error} If there is an error copying the directory.
 * @example
 *
 * const copyResult = await copyDir({
 *   input : '/path/to/sourceDir',
 *   output: '/path/to/destinationDir',
 * })
 */
export const copyDir = async ( {
	input,
	output,
}: {
	input  : string
	output : string
} ) => {

	const _copyDir = async ( {
		input,
		output,
	}: {
		input  : string
		output : string
	} ) => {

		// Read the source directory
		const entries = await readDir( input )

		// Create the destination directory if it doesn't exist
		await ensureDir( output )

		// Loop through the entries in the source directory
		for ( const entry of entries ) {

			const srcPath  = join( input, entry.name )
			const destPath = join( output, entry.name )

			if ( entry.isDirectory() ) {

				// Recursively copy the subdirectory
				await _copyDir( {
					input  : srcPath,
					output : destPath,
				} )

			}
			else {

				// Copy the file
				await copyFile( {
					input  : srcPath,
					output : destPath,
				} )

			}

		}

	}

	await _copyDir( {
		input,
		output,
	} )

	// console.log( `📁 Directory copied from ${input} to ${output}` )

}

/**
 * Creates a symbolic link from the input path to the output path.
 *
 * @param   {{input: string, output: string}} options - Options object with input and output paths.
 * @returns {Promise<void>}                           - Resolves when the symbolic link has been created.
 * @throws {Error} If there is an error creating the symbolic link.
 * @example import { createSymlink } from '@dovenv/utils'
 *
 * const symlinkResult = await createSymlink({
 *   input : '/path/to/source',
 *   output: '/path/to/destination',
 * })
 */
export const createSymlink = async ( {
	input, output,
}: {
	input  : string
	output : string
} ) => {

	try {

		await access( output )

	}
	catch ( error ) {

		// @ts-ignore
		if ( error.code === 'ENOENT' ) {

			// El directorio destino no existe, lo creamos
			await mkdir( output, { recursive: true } )

		}
		else {

			throw `❌🔗 ${error}`

		}

	}

	const sourceStat = await lstat( input )
	const isWin      = process.platform === 'win32'

	if ( sourceStat.isDirectory() ) {

		if ( isWin ) {

			// En Windows, debemos crear un enlace de tipo 'junction'
			await symlink( input, join( output, basename( input ) ), 'junction' )

		}
		else {

			// En Linux y macOS, podemos crear enlaces simbólicos directos a directorios
			await symlink( input, join( output, basename( input ) ), 'dir' )

		}

	}
	else if ( sourceStat.isFile() ) {

		// Si la fuente es un archivo, creamos un enlace simbólico a ese archivo
		await symlink( input, join( output, basename( input ) ) )

	}

}

