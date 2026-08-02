/* eslint-disable jsdoc/require-returns */
import { exec as nodeExec } from 'node:child_process'
import { promisify }        from 'node:util'

const execPromise = promisify( nodeExec )

class NotesSuper {

	protected async _exec( cmd: string ) {

		try {

			const { stdout } = await execPromise( cmd, { maxBuffer: 50 * 1024 * 1024 } )
			return stdout.toString().trim()

		}
		catch ( e ) {

			const error = e as Error & { stderr?: Buffer | string }
			throw new Error( error.stderr?.toString() || error.message, { cause: e } )

		}

	}

	protected async _executeAppleScript( script: string ) {

		return await this._exec( `osascript -e '${script.replace( /'/g, '\'\\\'\'' )}'` )

	}

	protected _escape( value: string ) {

		return value
			.replace( /\\/g, '\\\\' )
			.replace( /"/g, '\\"' )

	}

}

type InputFolder = string | string[]
type InputNote = string | string[]
type AppleNoteObject = {
	id               : string
	name             : string
	folder           : string[]
	creationDate     : string
	modificationDate : string
	body             : string
	plaintext        : string
}

type AppleNoteObjectFilter = {
	[K in keyof AppleNoteObject]?: AppleNoteObject[K] | string[]
}
export class Notes extends NotesSuper {

	CODE = {
		SUCCESS                   : 'success',
		ERROR_NONE_PARAMS         : 'error-none-params',
		ERROR_NONE_NOTE           : 'error-none-note',
		ERROR_NONE_FOLDER         : 'error-none-folder',
		ERROR_NONE_CHILD_FOLDER   : 'error-none-child-folder',
		ERROR_EXISTS_NOTE         : 'error-exists-note',
		ERROR_EXISTS_FOLDER       : 'error-exists-folder',
		ERROR_EXISTS_CHILD_FOLDER : 'error-exists-child-folder',
		ERROR_NONE_DEST_FOLDER    : 'error-none-dest-folder',
		ERROR_NOT_MACOS           : 'error-not-macos',
	} as const

	#setResult( result: string ) {

		if ( result.startsWith( 'error' ) ) throw new Error( result )
		return

	}

	/**
	 * Opens Apple Notes and focuses a specific note or folder path.
	 *
	 * @param {InputNote} target - Optional note name string or path array: ['ParentFolder', 'SubFolder', 'NoteName']
	 * @example
	 * ```typescript
	 * // Open app / default note
	 * await notes.open()
	 *
	 * // Open note globally
	 * await notes.open( 'Proyecto 2026' )
	 *
	 * // Open note inside nested folders
	 * await notes.open( [ 'Work', 'Projects', 'Q1 Report' ] )
	 * ```
	 */
	async open( target?: InputNote ) {

		let searchName = '',
			folderPath: string[] = []

		if ( typeof target === 'string' ) searchName = target
		else if ( Array.isArray( target ) ) {

			if ( target.length === 1 ) {

				searchName = target[0]

			}
			else if ( target.length > 1 ) {

				searchName = target[target.length - 1]
				folderPath = target.slice( 0, -1 )

			}

		}

		if ( searchName && folderPath.length > 0 ) {

			const folderSpecifier = folderPath
				.slice()
				.reverse()
				.map( name => `folder "${name}"` )
				.join( ' of ' )

			const script = `try
                tell application "Notes"
                    if not (exists ${folderSpecifier}) then return "${this.CODE.ERROR_NONE_FOLDER}"
                    
                    set noteList to (notes of ${folderSpecifier} whose name contains "${searchName}")
                    if (count of noteList) > 0 then
                        show (first item of noteList)
                        activate
                        return "${this.CODE.SUCCESS}"
                    else
                        return "${this.CODE.ERROR_NONE_NOTE}"
                    end if
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		if ( searchName ) {

			const script = `try
                tell application "Notes"
                    set noteList to (every note whose name contains "${searchName}")
                    if (count of noteList) > 0 then
                        show (first item of noteList)
                        activate
                        return "${this.CODE.SUCCESS}"
                    else
                        return "${this.CODE.ERROR_NONE_NOTE}"
                    end if
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		// 3. Abrir la app en la vista por defecto
		const script = `try
            tell application "Notes"
                show (first item of notes)
                activate
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Creates a new note in Apple Notes, brings it to focus, and activates the application.
	 * Can create a blank note, a titled note, or a note inside a nested folder path.
	 *
	 * @param {string | string[]} target - Optional title string or path array: ['ParentFolder', 'SubFolder', 'NoteTitle']
	 * @example
	 * ```typescript
	 * // 1. Create a blank note in the default root
	 * await notes.openNew()
	 *
	 * // 2. Create a note titled "Ideas 2026" in root
	 * await notes.openNew( 'Ideas 2026' )
	 *
	 * // 3. Create a note inside nested folders: Work > Projects > Meeting Notes
	 * await notes.openNew( [ 'Work', 'Projects', 'Meeting Notes' ] )
	 * ```
	 */
	async openNew( target?: InputNote ) {

		let noteTitle = '',
			folderPath: string[] = []

		if ( typeof target === 'string' ) {

			noteTitle = target

		}
		else if ( Array.isArray( target ) ) {

			if ( target.length === 1 ) {

				noteTitle = target[0]

			}
			else if ( target.length > 1 ) {

				noteTitle  = target[target.length - 1]
				folderPath = target.slice( 0, -1 )

			}

		}

		// Preparamos la propiedad body si hay un título especificado
		// En Apple Notes, el título es el primer elemento HTML (<h1> o <p>) del body
		const bodyProp = noteTitle ? ` with properties {body:"<h1>${noteTitle}</h1><p></p>"}` : ''

		// 1. Crear nueva nota dentro de una carpeta anidada (creando las carpetas si no existen)
		if ( folderPath.length > 0 ) {

			const scriptSteps: string[] = []

			// Garantizamos que toda la estructura de carpetas exista
			const rootFolder = folderPath[0]
			scriptSteps.push( `if not (exists folder "${rootFolder}") then make new folder with properties {name:"${rootFolder}"}` )

			for ( let i = 1; i < folderPath.length; i++ ) {

				const currentName = folderPath[i]
				const parentPath  = folderPath
					.slice( 0, i )
					.reverse()
					.map( name => `folder "${name}"` )
					.join( ' of ' )

				const targetPath = `folder "${currentName}" of ${parentPath}`

				scriptSteps.push(
					`if not (exists ${targetPath}) then `
					+ `make new folder at ${parentPath} with properties {name:"${currentName}"}`,
				)

			}

			const folderSpecifier = folderPath
				.slice()
				.reverse()
				.map( name => `folder "${name}"` )
				.join( ' of ' )

			const script = `try
                tell application "Notes"
                    ${scriptSteps.join( '\n                    ' )}

                    set newNote to make new note at ${folderSpecifier}${bodyProp}
                    show newNote
                    activate
                    return "${this.CODE.SUCCESS}"
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		// 2. Crear nueva nota en la raíz (con o sin título)
		const script = `try
            tell application "Notes"
                set newNote to make new note${bodyProp}
                show newNote
                activate
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	// #########################################################################
	// FOLDER
	// #########################################################################

	/**
	 * Creates a new root folder or nested subfolder hierarchy in Apple Notes.
	 *
	 * @param {InputFolder} folder - Folder name or path array.
	 * @example
	 * ```typescript
	 * // Single root folder
	 * await this.addFolder( 'Work' )
	 *
	 * // Nested hierarchy: Work > Projects > 2026
	 * await this.addFolder( [ 'Work', 'Projects', '2026' ] )
	 * ```
	 */
	async addFolder( folder: InputFolder ) {

		const folders = Array.isArray( folder ) ? folder : ( folder ? [ folder ] : [] )

		if ( folders.length === 0 ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const rootFolder = folders[0]

		if ( folders.length === 1 ) {

			const script = `try
            tell application "Notes"
                if (exists folder "${rootFolder}") then return "${this.CODE.ERROR_EXISTS_FOLDER}"
                make new folder with properties {name:"${rootFolder}"}
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		const scriptSteps: string[] = [ `if not (exists folder "${rootFolder}") then make new folder with properties {name:"${rootFolder}"}` ]

		for ( let i = 1; i < folders.length; i++ ) {

			const currentName = folders[i]

			const parentPath = folders
				.slice( 0, i )
				.reverse()
				.map( name => `folder "${name}"` )
				.join( ' of ' )

			const targetPath = `folder "${currentName}" of ${parentPath}`

			scriptSteps.push(
				`if not (exists ${targetPath}) then `
				+ `make new folder at ${parentPath} with properties {name:"${currentName}"}`,
			)

		}

		const script = `try
        tell application "Notes"
            ${scriptSteps.join( '\n            ' )}
            return "${this.CODE.SUCCESS}"
        end tell
    end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Removes a folder or its notes in Apple Notes.
	 *
	 * @param {InputFolder} folder              - Folder name or path array.
	 * @param {object}      [options]           - Additional options like removing only the notes inside.
	 * @param {boolean}     [options.onlyNotes] - Remove only the notes inside
	 * @example
	 * ```typescript
	 * // Delete a root folder
	 * await this.rmFolder( 'Work' )
	 *
	 * // Delete a nested folder
	 * await this.rmFolder( [ 'Work', 'Projects', '2026' ] )
	 *
	 * // Delete only the notes inside a nested folder
	 * await this.rmFolder( [ 'Work', 'Projects' ], { onlyNotes: true } )
	 * ```
	 */
	async rmFolder( folder: InputFolder, options: { onlyNotes?: boolean } = {} ) {

		const folders = Array.isArray( folder )
			? folder
			: ( folder ? [ folder ] : [] )

		if ( folders.length === 0 ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const targetSpecifier = folders
			.slice()
			.reverse()
			.map( name => `folder "${this._escape( name )}"` )
			.join( ' of ' )

		const isOnlyNotes = Boolean( options?.onlyNotes )

		const script = `try
            tell application "Notes"
                if not (exists ${targetSpecifier}) then
                    return "${folders.length > 1 ? this.CODE.ERROR_NONE_CHILD_FOLDER : this.CODE.ERROR_NONE_FOLDER}"
                end if

                ${isOnlyNotes
					? `
                if exists notes of ${targetSpecifier} then
                    delete notes of ${targetSpecifier}
                end if
                `
					: `
                delete ${targetSpecifier}
                `}

                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Checks if a folder or nested folder path exists in Apple Notes.
	 *
	 * @param {InputFolder} folder - Folder name or path array.
	 * @example
	 * ```typescript
	 * // Check root folder
	 * await this.existsFolder( 'Work' )
	 *
	 * // Check nested path
	 * await this.existsFolder( [ 'Work', 'Projects', '2026' ] )
	 * ```
	 */
	async existsFolder( folder: InputFolder ) {

		const folders = Array.isArray( folder )
			? folder
			: ( folder ? [ folder ] : [] )

		if ( folders.length === 0 ) return false

		const targetSpecifier = folders
			.slice()
			.reverse()
			.map( name => `folder "${name}"` )
			.join( ' of ' )

		const script = `try
            tell application "Notes"
                if exists ${targetSpecifier} then
                    return "true"
                else
                    return "false"
                end if
            end tell
        on error
            return "false"
        end try`

		const result = await this._executeAppleScript( script )
		return result === 'true'

	}

	// #########################################################################
	// NOTES
	// #########################################################################

	/**
	 * Retrieves a list of notes matching optional filter criteria.
	 * Supports single filter objects, arrays of filters (evaluated with OR logic), or multiple query values per property.
	 *
	 * @param   {AppleNoteObjectFilter | AppleNoteObjectFilter[]} [filter] - Optional single filter criteria or array of filter objects.
	 * @returns {Promise<Array<AppleNoteObject>>}                          A promise that resolves to an array of matching note objects
	 *                                                                     including the `body` (HTML) and `plaintext` content.
	 * @example
	 * // 1. Retrieve all notes (no filter)
	 * const allNotes = await notes.get()
	 *
	 * // 2. Filter by partial name match
	 * const meetingNotes = await notes.get({ name: 'Meeting' })
	 *
	 * // 3. Filter by exact parent folder hierarchy
	 * const projectNotes = await notes.get({ folder: ['Work', 'Projects'] })
	 *
	 * // 4. Filter by multiple target names in a single query
	 * const selectedNotes = await notes.get({ name: ['Ideas', 'Q1 Roadmap', 'Shopping List'] })
	 *
	 * // 5. Filter using multiple criteria objects (OR logic)
	 * const results = await notes.get([
	 *   { name: 'Ideas', folder: ['Personal'] },
	 *   { name: 'Roadmap', folder: ['Work', 'Projects'] }
	 * ])
	 */
	async get( filter?: AppleNoteObjectFilter | AppleNoteObjectFilter[] ): Promise<Array<AppleNoteObject>> {

		const script = `
        on getFolderPath(aFolder)
            tell application "Notes"
                set pathList to {name of aFolder}
                set currentFolder to aFolder
                repeat
                    try
                        set parentFolder to container of currentFolder
                        if class of parentFolder is folder then
                            set beginning of pathList to name of parentFolder
                            set currentFolder to parentFolder
                        else
                            exit repeat
                        end if
                    on error
                        exit repeat
                    end try
                end repeat
                return pathList
            end tell
        end getFolderPath

        tell application "Notes"
            set noteIds to id of every note
            set noteNames to name of every note
            set noteCDates to creation date of every note
            set noteMDates to modification date of every note
            set noteContainers to container of every note
            set totalNotes to count of noteIds
            
            set resultList to {}
            
            repeat with i from 1 to totalNotes
                set noteId to item i of noteIds
                set noteName to item i of noteNames
                set cDate to item i of noteCDates as string
                set mDate to item i of noteMDates as string
                set noteBody to body of note id noteId
                set notePlainText to plaintext of note id noteId
                set parentContainer to item i of noteContainers
                
                set folderPath to {}
                try
                    if class of parentContainer is folder then
                        set folderPath to my getFolderPath(parentContainer)
                    end if
                end try
                
                set oldDelims to my text item delimiters
                set my text item delimiters to "///"
                set folderStr to folderPath as string
                set my text item delimiters to oldDelims
                
                set noteData to noteId & "|||" & noteName & "|||" & folderStr & "|||" & cDate & "|||" & mDate & "|||" & noteBody & "|||" & notePlainText
                set end of resultList to noteData
            end repeat
            
            set oldDelims to my text item delimiters
            set my text item delimiters to "&&&"
            set finalOutput to resultList as string
            set my text item delimiters to oldDelims
            
            return finalOutput
        end tell`

		const rawResult = await this._executeAppleScript( script )
		this.#setResult( rawResult )

		if ( !rawResult ) return []

		const notesRaw = rawResult.split( '&&&' )

		const allNotes = notesRaw.map( noteStr => {

			const [
				id,
				name,
				folderStr,
				creationDate,
				modificationDate,
				body,
				plaintext,
			] = noteStr.split( '|||' )
			const folder = folderStr ? folderStr.split( '///' ) : []

			return {
				id,
				name,
				folder,
				creationDate,
				modificationDate,
				body,
				plaintext,
			}

		} )

		if ( !filter ) return allNotes

		const filters = Array.isArray( filter ) ? filter : [ filter ]
		if ( filters.length === 0 ) return allNotes

		// Función auxilary para evaluar un único objeto de filtro contra una nota
		const matchSingleFilter = ( note: AppleNoteObject, f: AppleNoteObjectFilter ): boolean => {

			// 1. Filtrado por ID
			if ( f.id ) {

				const ids = Array.isArray( f.id ) ? f.id : [ f.id ]
				if ( !ids.includes( note.id ) ) return false

			}

			// 2. Filtrado por Nombre (soporta substrings y array de nombres)
			if ( f.name ) {

				const names       = Array.isArray( f.name ) ? f.name : [ f.name ]
				const matchesName = names.some( n => note.name.toLowerCase().includes( n.toLowerCase() ) )
				if ( !matchesName ) return false

			}

			// 3. Filtrado por Folder
			if ( f.folder ) {

				const noteFolderStr = note.folder.join( '/' ).toLowerCase()

				if ( Array.isArray( f.folder[0] ) ) {

					// Array de carpetas: [['Work'], ['Personal', 'Projects']]
					const targetFolders = ( f.folder as unknown as string[][] ).map( path => path.join( '/' ).toLowerCase() )
					if ( !targetFolders.includes( noteFolderStr ) ) return false

				}
				else {

					// Una sola ruta de carpeta: ['Work', 'Projects']
					const targetFolderStr = ( f.folder as string[] ).join( '/' ).toLowerCase()
					if ( noteFolderStr !== targetFolderStr ) return false

				}

			}

			return true

		}

		// Si la nota coincide con AL MENOS UNO de los filtros del array, pasa
		return allNotes.filter( note => filters.some( f => matchSingleFilter( note, f ) ) )

	}

	/**
	 * Creates a new note in Apple Notes. Automatically creates any missing parent folders in the path.
	 *
	 * @param {InputNote} target - Note title string or path array: `['ParentFolder', 'SubFolder', 'NoteTitle']`.
	 * @example
	 * ```typescript
	 * // Create note in root
	 * await notes.add( 'Shopping List' )
	 *
	 * // Create note inside nested folders (creates Work/Projects if missing)
	 * await notes.add( [ 'Work', 'Projects', 'Q1 Roadmap' ] )
	 * ```
	 */
	async add( target: InputNote ) {

		const path = Array.isArray( target )
			? target
			: ( target ? [ target ] : [] )

		if ( path.length === 0 ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const noteTitle  = path[path.length - 1]
		const folderPath = path.slice( 0, -1 )

		// 1. Root level note
		if ( folderPath.length === 0 ) {

			const script = `try
                tell application "Notes"
                    if (exists note named "${noteTitle}") then return "${this.CODE.ERROR_EXISTS_NOTE}"
                    make new note with properties {name:"${noteTitle}"}
                    return "${this.CODE.SUCCESS}"
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		// 2. Nested folder note
		const scriptSteps: string[] = []

		// Ensure all parent folder structures exist before creating the note
		const rootFolder = folderPath[0]
		scriptSteps.push( `if not (exists folder "${rootFolder}") then make new folder with properties {name:"${rootFolder}"}` )

		for ( let i = 1; i < folderPath.length; i++ ) {

			const currentName = folderPath[i]
			const parentPath  = folderPath
				.slice( 0, i )
				.reverse()
				.map( name => `folder "${name}"` )
				.join( ' of ' )

			const targetPath = `folder "${currentName}" of ${parentPath}`

			scriptSteps.push(
				`if not (exists ${targetPath}) then `
				+ `make new folder at ${parentPath} with properties {name:"${currentName}"}`,
			)

		}

		const targetFolderSpecifier = folderPath
			.slice()
			.reverse()
			.map( name => `folder "${name}"` )
			.join( ' of ' )

		const script = `try
            tell application "Notes"
                ${scriptSteps.join( '\n                ' )}
                
                if (exists note named "${noteTitle}" of ${targetFolderSpecifier}) then
                    return "${this.CODE.ERROR_EXISTS_NOTE}"
                end if

                make new note at ${targetFolderSpecifier} with properties {name:"${noteTitle}"}
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Removes a note from Apple Notes (from root or inside nested folders).
	 *
	 * @param {InputNote} target - Note title string or path array: `['ParentFolder', 'SubFolder', 'NoteTitle']`.
	 * @example
	 * ```typescript
	 * // Delete note from root
	 * await notes.rm( 'Shopping List' )
	 *
	 * // Delete note from nested folders
	 * await notes.rm( [ 'Work', 'Projects', 'Q1 Roadmap' ] )
	 * ```
	 */
	async rm( target: InputNote ) {

		const path = Array.isArray( target )
			? target
			: ( target ? [ target ] : [] )

		if ( path.length === 0 ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const noteTitle  = path[path.length - 1]
		const folderPath = path.slice( 0, -1 )

		// 1. Root level note deletion
		if ( folderPath.length === 0 ) {

			const script = `try
                tell application "Notes"
                    if not (exists (first note whose name is "${this._escape( noteTitle )}")) then
                        return "${this.CODE.ERROR_NONE_NOTE}"
                    end if
                    delete (first note whose name is "${this._escape( noteTitle )}")
                    return "${this.CODE.SUCCESS}"
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		// 2. Nested folder note deletion
		const targetFolderSpecifier = folderPath
			.slice()
			.reverse()
			.map( name => `folder "${this._escape( name )}"` )
			.join( ' of ' )

		const script = `try
            tell application "Notes"
                if not (exists ${targetFolderSpecifier}) then
                    return "${folderPath.length > 1 ? this.CODE.ERROR_NONE_CHILD_FOLDER : this.CODE.ERROR_NONE_FOLDER}"
                end if

                if not (exists (first note of ${targetFolderSpecifier} whose name is "${this._escape( noteTitle )}")) then
                    return "${this.CODE.ERROR_NONE_NOTE}"
                end if

                delete (first note of ${targetFolderSpecifier} whose name is "${this._escape( noteTitle )}")
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Checks whether a note exists in Apple Notes (at root level or within a nested folder path).
	 *
	 * @param   {InputNote}        target - Note title string or path array: `['ParentFolder', 'SubFolder', 'NoteTitle']`.
	 * @returns {Promise<boolean>}        Resolves to `true` if the note exists, or `false` otherwise.
	 * @example
	 * ```typescript
	 * // Check note in root
	 * const isPresent = await notes.exists( 'Shopping List' )
	 *
	 * // Check note in nested folders
	 * const isPresent = await notes.exists( [ 'Work', 'Projects', 'Q1 Roadmap' ] )
	 * ```
	 */
	async exists( target: InputNote ): Promise<boolean> {

		const path = Array.isArray( target )
			? target
			: ( target ? [ target ] : [] )

		if ( path.length === 0 ) return false

		const noteTitle  = path[path.length - 1]
		const folderPath = path.slice( 0, -1 )

		// 1. Root level note check
		if ( folderPath.length === 0 ) {

			const script = `try
                tell application "Notes"
                    if exists (first note whose name is "${noteTitle}") then
                        return "true"
                    else
                        return "false"
                    end if
                end tell
            on error
                return "false"
            end try`

			const result = await this._executeAppleScript( script )
			return result === 'true'

		}

		// 2. Nested folder note check
		const targetFolderSpecifier = folderPath
			.slice()
			.reverse()
			.map( name => `folder "${name}"` )
			.join( ' of ' )

		const script = `try
            tell application "Notes"
                if not (exists ${targetFolderSpecifier}) then return "false"

                if exists (first note of ${targetFolderSpecifier} whose name is "${noteTitle}") then
                    return "true"
                else
                    return "false"
                end if
            end tell
        on error
            return "false"
        end try`

		const result = await this._executeAppleScript( script )
		return result === 'true'

	}

	/**
	 * Moves an existing note to a target folder. Creates the destination folder if it does not exist.
	 *
	 * @param {string | string[]} source     - Note title string or path array: `['ParentFolder', 'NoteTitle']`.
	 * @param {string | string[]} destFolder - Destination folder name or path array.
	 * @example
	 * ```typescript
	 * // Move a root note into a folder
	 * await notes.move( 'Shopping List', 'Work' )
	 *
	 * // Move a note from a nested folder into another folder
	 * await notes.move( [ 'Work', 'Drafts', 'Q1 Report' ], [ 'Archive', '2026' ] )
	 * ```
	 */
	async move( source: string | string[], destFolder: string | string[] ) {

		const sourcePath = Array.isArray( source )
			? source
			: ( source ? [ source ] : [] )

		const destPath = Array.isArray( destFolder )
			? destFolder
			: ( destFolder ? [ destFolder ] : [] )

		if ( sourcePath.length === 0 || destPath.length === 0 ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const noteTitle     = sourcePath[sourcePath.length - 1]
		const sourceFolders = sourcePath.slice( 0, -1 )

		const sourceSpecifier = sourceFolders.length > 0
			? `(first note of ${sourceFolders
				.slice()
				.reverse()
				.map( name => `folder "${this._escape( name )}"` )
				.join( ' of ' )} whose name is "${this._escape( noteTitle )}")`
			: `(first note whose name is "${this._escape( noteTitle )}")`

		const destSpecifier = destPath
			.slice()
			.reverse()
			.map( name => `folder "${this._escape( name )}"` )
			.join( ' of ' )

		const script = `try
            tell application "Notes"
                if not (exists ${destSpecifier}) then return "${this.CODE.ERROR_NONE_DEST_FOLDER}"
                if not (exists ${sourceSpecifier}) then return "${this.CODE.ERROR_NONE_NOTE}"
                move ${sourceSpecifier} to ${destSpecifier}
                return "${this.CODE.SUCCESS}"
            end tell
        end try`

		const result = await this._executeAppleScript( script )
		return this.#setResult( result )

	}

	/**
	 * Renames an existing note or folder. When the target matches both a note and a folder,
	 * the note takes precedence.
	 *
	 * @param {string | string[]} target  - Note/folder title string or path array: `['ParentFolder', 'Target']`.
	 * @param {string}            newName - The new name.
	 * @example
	 * ```typescript
	 * // Rename a root note
	 * await notes.rename( 'Shopping List', 'Groceries' )
	 *
	 * // Rename a note inside a folder
	 * await notes.rename( [ 'Work', 'Q1 Roadmap' ], 'Q2 Roadmap' )
	 *
	 * // Rename a folder
	 * await notes.rename( [ 'Work', 'Old Projects' ], 'Archived Projects' )
	 * ```
	 */
	async rename( target: string | string[], newName: string ) {

		const path = Array.isArray( target )
			? target
			: ( target ? [ target ] : [] )

		if ( path.length === 0 || !newName ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const escapedNewName = this._escape( newName )

		// 1. Prefer renaming a note
		if ( await this.exists( path ) ) {

			const noteTitle  = path[path.length - 1]
			const folderPath = path.slice( 0, -1 )

			const specifier = folderPath.length > 0
				? `first note of ${folderPath
					.slice()
					.reverse()
					.map( name => `folder "${this._escape( name )}"` )
					.join( ' of ' )} whose name is "${this._escape( noteTitle )}"`
				: `first note whose name is "${this._escape( noteTitle )}"`

			const script = `try
                tell application "Notes"
                    if not (exists ${specifier}) then return "${this.CODE.ERROR_NONE_NOTE}"
                    set name of ${specifier} to "${escapedNewName}"
                    return "${this.CODE.SUCCESS}"
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		// 2. Fallback: rename a folder
		if ( await this.existsFolder( path ) ) {

			const specifier = path
				.slice()
				.reverse()
				.map( name => `folder "${this._escape( name )}"` )
				.join( ' of ' )

			const script = `try
                tell application "Notes"
                    if not (exists ${specifier}) then return "${this.CODE.ERROR_NONE_FOLDER}"
                    set name of ${specifier} to "${escapedNewName}"
                    return "${this.CODE.SUCCESS}"
                end tell
            end try`

			const result = await this._executeAppleScript( script )
			return this.#setResult( result )

		}

		return this.#setResult( this.CODE.ERROR_NONE_NOTE )

	}

}
