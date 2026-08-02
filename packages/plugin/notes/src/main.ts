import {
	errorStyle,
	infoStyle,
	successStyle,
	UmacCommand,
} from '@umac-js/utils'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'
import { Notes } from './core'

export const CMD = {
	OPEN          : 'open',
	OPEN_NEW      : 'open-new',
	ADD           : 'add',
	REMOVE        : 'remove',
	ADD_FOLDER    : 'add-folder',
	REMOVE_FOLDER : 'remove-folder',
	MOVE          : 'move',
	RENAME        : 'rename',
	EXISTS        : 'exists',
	LIST          : 'list',
} as const

const cli = new UmacCommand( {
	description,
	version,
	name     : BIN_NAME,
	helpURL  : HELP_URL,
	helpOpts : {
		cmds : [
			{
				value    : CMD.OPEN,
				desc     : 'Open Apple Notes app or focus a specific note',
				examples : [
					{
						desc  : 'Open Apple Notes app',
						value : '$0 open',
					},
					{
						desc  : 'Open a note named "Ideas"',
						value : '$0 open "Ideas"',
					},
					{
						desc  : 'Open note inside folder path',
						value : '$0 open "Work" "Projects" "Ideas"',
					},
				],
			},
			{
				value    : CMD.OPEN_NEW,
				desc     : 'Create and focus a new blank note or a titled note in a folder path',
				examples : [
					{
						desc  : 'Create blank new note',
						value : '$0 open-new',
					},
					{
						desc  : 'Create and focus note with title',
						value : '$0 open-new "Quick Note"',
					},
					{
						desc  : 'Create and focus inside subfolders',
						value : '$0 open-new "Work" "Meeting Notes"',
					},
				],
			},
			{
				value    : CMD.ADD,
				desc     : 'Create a new note (creates parent folders if missing)',
				examples : [
					{
						desc  : 'Create note in root',
						value : '$0 add "Shopping List"',
					},
					{
						desc  : 'Create note in folder structure',
						value : '$0 add "Work" "Projects" "Q1 Roadmap"',
					},
				],
			},
			{
				value    : CMD.REMOVE,
				desc     : 'Remove a note by title or path',
				examples : [
					{
						desc  : 'Remove note from root',
						value : '$0 remove "Shopping List"',
					},
					{
						desc  : 'Remove note from folder',
						value : '$0 remove "Work" "Projects" "Q1 Roadmap"',
					},
				],
			},
			{
				value    : CMD.ADD_FOLDER,
				desc     : 'Create a new folder or nested subfolders hierarchy',
				examples : [
					{
						desc  : 'Create root folder',
						value : '$0 add-folder "Work"',
					},
					{
						desc  : 'Create nested subfolders',
						value : '$0 add-folder "Work" "Projects" "2026"',
					},
				],
			},
			{
				value : CMD.REMOVE_FOLDER,
				desc  : 'Remove a folder or nested folder path',
				flags : [
					{
						value : '--only-notes',
						desc  : 'Remove only the notes inside the specified folder',
					},
				],
				examples : [
					{
						desc  : 'Delete folder and contents',
						value : '$0 remove-folder "Work" "Old Projects"',
					},
					{
						desc  : 'Delete only notes inside folder',
						value : '$0 remove-folder "Work" "Drafts" --only-notes',
					},
				],
			},
			{
				value : CMD.MOVE,
				desc  : 'Move a note to a target folder',
				flags : [
					{
						value : '-t, --to <path...>',
						desc  : 'Destination folder path',
					},
				],
				examples : [
					{
						desc  : 'Move a note from root to a folder',
						value : '$0 move "Shopping List" --to "Work"',
					},
					{
						desc  : 'Move a note from a folder to a nested destination',
						value : '$0 move "Work" "Drafts" "Q1 Report" --to "Archive" "2026"',
					},
				],
			},
			{
				value : CMD.RENAME,
				desc  : 'Rename a note or folder',
				flags : [
					{
						value : '-n, --name <string>',
						desc  : 'New name',
					},
				],
				examples : [
					{
						desc  : 'Rename a note in root',
						value : '$0 rename "Shopping List" --name "Groceries"',
					},
					{
						desc  : 'Rename a note inside a folder',
						value : '$0 rename "Work" "Q1 Roadmap" --name "Q2 Roadmap"',
					},
				],
			},
			{
				value    : CMD.EXISTS,
				desc     : 'Check if a note or folder exists',
				examples : [
					{
						desc  : 'Check note or folder in root',
						value : '$0 exists "Work"',
					},
					{
						desc  : 'Check nested note or folder',
						value : '$0 exists "Work" "Projects" "Q1 Roadmap"',
					},
				],
			},
			{
				value : CMD.LIST,
				desc  : 'List all notes with their metadata',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
					{
						value : '-n, --name <string...>',
						desc  : 'Filter by note name (supports multiple names)',
					},
					{
						value : '-f, --folder <path...>',
						desc  : 'Filter by folder path (e.g. --folder "Work" "Projects")',
					},
					{
						value : '-i, --id <string...>',
						desc  : 'Filter by note ID',
					},
				],
				examples : [
					{
						desc  : 'List all notes in text format',
						value : '$0 list',
					},
					{
						desc  : 'Filter notes by name containing "Meeting"',
						value : '$0 list --name "Meeting"',
					},
					{
						desc  : 'Filter notes in specific folder path',
						value : '$0 list --folder "Work" "Projects"',
					},
					{
						desc  : 'Output filtered notes as JSON',
						value : '$0 list --name "Ideas" "Roadmap" --res=json',
					},
				],
			},
		],
	},
	fn : async ( { argv } ) => {

		const notes = new Notes()

		// 1. OPEN
		if ( argv.existsCmd( CMD.OPEN ) ) {

			const target = argv.getCmdValues( CMD.OPEN ) || []

			await notes.open( target.length > 0 ? target : undefined )
			console.log( successStyle( `Apple Notes opened successfully` ) )

		}
		// 2. OPEN NEW
		else if ( argv.existsCmd( CMD.OPEN_NEW ) ) {

			const target = argv.getCmdValues( CMD.OPEN_NEW ) || []
			console.log( target )
			await notes.openNew( target.length > 0 ? target : undefined )
			console.log( successStyle( `New note created and brought to focus` ) )

		}
		// 3. ADD NOTE
		else if ( argv.existsCmd( CMD.ADD ) ) {

			const target = argv.getCmdValues( CMD.ADD ) || []
			if ( target.length === 0 ) {

				console.log( errorStyle( `Please specify a note name or path. Example: notes add "Work" "Meeting Notes"` ) )
				return

			}
			await notes.add( target )
			console.log( successStyle( `Note "${target.join( ' > ' )}" created successfully` ) )

		}
		// 4. REMOVE NOTE
		else if ( argv.existsCmd( CMD.REMOVE ) ) {

			const target = argv.getCmdValues( CMD.REMOVE ) || []
			if ( target.length === 0 ) {

				console.log( errorStyle( `Please specify a note name or path to remove.` ) )
				return

			}
			await notes.rm( target )
			console.log( successStyle( `Note "${target.join( ' > ' )}" removed successfully` ) )

		}
		// 5. ADD FOLDER
		else if ( argv.existsCmd( CMD.ADD_FOLDER ) ) {

			const target = argv.getCmdValues( CMD.ADD_FOLDER ) || []
			if ( target.length === 0 ) {

				console.log( errorStyle( `Please specify a folder name or nested path to create.` ) )
				return

			}
			await notes.addFolder( target )
			console.log( successStyle( `Folder "${target.join( ' > ' )}" created successfully` ) )

		}
		// 6. REMOVE FOLDER
		else if ( argv.existsCmd( CMD.REMOVE_FOLDER ) ) {

			const target = argv.getCmdValues( CMD.REMOVE_FOLDER ) || []
			if ( target.length === 0 ) {

				console.log( errorStyle( `Please specify a folder name or path to remove.` ) )
				return

			}

			const onlyNotes = argv.existsFlag( 'only-notes' )
			await notes.rmFolder( target, { onlyNotes } )

			if ( onlyNotes ) {

				console.log( successStyle( `Notes inside folder "${target.join( ' > ' )}" removed successfully` ) )

			}
			else {

				console.log( successStyle( `Folder "${target.join( ' > ' )}" removed successfully` ) )

			}

		}
		// 7. MOVE NOTE
		else if ( argv.existsCmd( CMD.MOVE ) ) {

			const source = argv.getCmdValues( CMD.MOVE ) || []
			const dest   = argv.getFlagValues( 'to' ) || argv.getFlagValues( 't' )

			if ( source.length === 0 || !dest || dest.length === 0 ) {

				console.log( errorStyle( `Please specify a note and a destination folder. Example: notes move "Note" --to "Folder"` ) )
				return

			}

			await notes.move( source, dest )
			console.log( successStyle( `Note "${source.join( ' > ' )}" moved to "${dest.join( ' > ' )}" successfully` ) )

		}
		// 8. RENAME NOTE / FOLDER
		else if ( argv.existsCmd( CMD.RENAME ) ) {

			const target  = argv.getCmdValues( CMD.RENAME ) || []
			const newName = argv.getFlagValue( 'name' ) || argv.getFlagValue( 'n' )

			if ( target.length === 0 || !newName ) {

				console.log( errorStyle( `Please specify a note or folder and a new name. Example: notes rename "Note" --name "New Name"` ) )
				return

			}

			await notes.rename( target, newName )
			console.log( successStyle( `"${target.join( ' > ' )}" renamed to "${newName}" successfully` ) )

		}
		// 9. EXISTS CHECK
		else if ( argv.existsCmd( CMD.EXISTS ) ) {

			const target = argv.getCmdValues( CMD.EXISTS ) || []
			if ( target.length === 0 ) {

				console.log( errorStyle( `Please specify a note or folder path to check.` ) )
				return

			}

			const isNote   = await notes.exists( target )
			const isFolder = !isNote && await notes.existsFolder( target )

			if ( isNote ) {

				console.log( infoStyle( [ 'Note:', `"${target.join( ' > ' )}" exists` ] ) )

			}
			else if ( isFolder ) {

				console.log( infoStyle( [ 'Folder:', `"${target.join( ' > ' )}" exists` ] ) )

			}
			else {

				console.log( infoStyle( [ 'Status:', `"${target.join( ' > ' )}" does not exist` ] ) )

			}

		}
		// 9. LIST / GET NOTES WITH FILTERS
		else if ( argv.existsCmd( CMD.LIST ) ) {

			const format = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'

			// Extraemos los valores de las banderas
			const nameFilter   = argv.getFlagValues( 'name' ) || argv.getFlagValues( 'n' )
			const folderFilter = argv.getFlagValues( 'folder' ) || argv.getFlagValues( 'f' )
			const idFilter     = argv.getFlagValues( 'id' ) || argv.getFlagValues( 'i' )

			// Construimos el objeto filtro sólo si se enviaron flags
			const filterObject: Record<string, unknown> = {}

			if ( nameFilter && nameFilter.length > 0 ) {

				filterObject.name = nameFilter.length === 1 ? nameFilter[0] : nameFilter

			}

			if ( folderFilter && folderFilter.length > 0 ) {

				filterObject.folder = folderFilter

			}

			if ( idFilter && idFilter.length > 0 ) {

				filterObject.id = idFilter.length === 1 ? idFilter[0] : idFilter

			}

			const hasFilters = Object.keys( filterObject ).length > 0
			const allNotes   = await notes.get( hasFilters ? filterObject : undefined )

			if ( format === 'json' ) {

				console.log( JSON.stringify( allNotes ) )

			}
			else {

				console.log( infoStyle( [ 'Total Notes:', `${allNotes.length}` ] ) )

				if ( allNotes.length === 0 ) return

				const formattedList = allNotes.map( ( note, index ) => {

					const folderPath = note.folder.length > 0 ? note.folder.join( ' > ' ) : '/'

					return [
						`${index + 1}. [${note.name}]\n`,
						`• Folder   : ${folderPath}`,
						`• ID       : ${note.id}`,
						`• Name     : ${note.name}`,
						`• Created  : ${note.creationDate}`,
						`• Modified : ${note.modificationDate}`,
						`\n${note.plaintext || '🔒 Content protected!!'}`,
					].join( '\n' )

				} ).join( '\n\n' )

				console.log( `\n${formattedList}\n` )

			}

		}

	},
} )

export default cli
export {
	cli,
	Notes,
}
