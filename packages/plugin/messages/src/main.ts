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
import { Messages } from './core'

export const CMD = {
	OPEN     : 'open',
	SEND     : 'send',
	LIST     : 'list',
	MESSAGES : 'messages',
	SERVICES : 'services',
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
				desc     : 'Open the Messages app',
				examples : [
					{
						desc  : 'Open Messages app',
						value : '$0 open',
					},
				],
			},
			{
				value : CMD.SEND,
				desc  : 'Send a message to a buddy handle or a chat id',
				flags : [
					{
						value : '-t, --to <target>',
						desc  : 'Buddy handle (email/phone) or chat id (GUID)',
					},
					{
						value : '-m, --message <string>',
						desc  : 'Text to send',
					},
					{
						value : '-s, --service <id>',
						desc  : 'Optional service id to send through (buddy targets)',
					},
				],
				examples : [
					{
						desc  : 'Send to a buddy by handle',
						value : '$0 send -t "angel@pigeonposse.com" -m "Hola!"',
					},
					{
						desc  : 'Send to a specific chat by id',
						value : '$0 send -t "iMessage;-;angel@pigeonposse.com" -m "Hola!"',
					},
				],
			},
			{
				value : CMD.LIST,
				desc  : 'List the currently open chats',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
					{
						value : '-n, --name <string...>',
						desc  : 'Filter by chat name (supports multiple names)',
					},
					{
						value : '-p, --participants <string...>',
						desc  : 'Filter by participant handle',
					},
					{
						value : '-s, --service <string...>',
						desc  : 'Filter by service id (account)',
					},
				],
				examples : [
					{
						desc  : 'List all open chats in text format',
						value : '$0 list',
					},
					{
						desc  : 'Filter chats by name',
						value : '$0 list --name "Work"',
					},
					{
						desc  : 'Filter chats by participant',
						value : '$0 list --participants "angelo@pigeonposse.com"',
					},
					{
						desc  : 'Output chats as JSON',
						value : '$0 list --res=json',
					},
				],
			},
			{
				value : CMD.MESSAGES,
				desc  : 'Read the messages of a chat',
				flags : [
					{
						value : '-l, --limit <number>',
						desc  : 'Maximum number of messages to return',
					},
				],
				examples : [
					{
						desc  : 'Read all messages of a chat',
						value : '$0 messages "iMessage;-;angelo@pigeonposse.com"',
					},
					{
						desc  : 'Read only the last 10 messages',
						value : '$0 messages "iMessage;-;angelo@pigeonposse.com" --limit 10',
					},
				],
			},
			{
				value : CMD.SERVICES,
				desc  : 'List the services configured in Messages',
				flags : [
					{
						value : '-r, --res',
						desc  : 'Output format: "text" (default) or "json"',
					},
				],
				examples : [
					{
						desc  : 'List services in text format',
						value : '$0 services',
					},
					{
						desc  : 'List services as JSON',
						value : '$0 services --res=json',
					},
				],
			},
		],
	},
	fn : async ( { argv } ) => {

		const messages = new Messages()

		// 1. OPEN
		if ( argv.existsCmd( CMD.OPEN ) ) {

			await messages.open()
			console.log( successStyle( `Messages app opened successfully` ) )

		}
		// 2. SEND
		else if ( argv.existsCmd( CMD.SEND ) ) {

			const target  = argv.getFlagValue( 'to' ) || argv.getFlagValue( 't' )
			const message = argv.getFlagValue( 'message' ) || argv.getFlagValue( 'm' )
			const service = argv.getFlagValue( 'service' ) || argv.getFlagValue( 's' )

			if ( !target || !message ) {

				console.log( errorStyle( `Please specify a target and a message. Example: messages send -t "+angel@pigeonposse.com" -m "Hola!"` ) )
				return

			}

			await messages.send( target, message, service ? { service } : {} )
			console.log( successStyle( `Message sent to "${target}" successfully` ) )

		}
		// 3. LIST CHATS
		else if ( argv.existsCmd( CMD.LIST ) ) {

			const format = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'

			const nameFilter         = argv.getFlagValues( 'name' ) || argv.getFlagValues( 'n' )
			const participantsFilter = argv.getFlagValues( 'participants' ) || argv.getFlagValues( 'p' )
			const serviceFilter      = argv.getFlagValues( 'service' ) || argv.getFlagValues( 's' )

			const filterObject: Record<string, unknown> = {}

			if ( nameFilter && nameFilter.length > 0 ) {

				filterObject.name = nameFilter.length === 1 ? nameFilter[0] : nameFilter

			}

			if ( participantsFilter && participantsFilter.length > 0 ) {

				filterObject.participants = participantsFilter.length === 1 ? participantsFilter[0] : participantsFilter

			}

			if ( serviceFilter && serviceFilter.length > 0 ) {

				filterObject.service = serviceFilter.length === 1 ? serviceFilter[0] : serviceFilter

			}

			const hasFilters = Object.keys( filterObject ).length > 0
			const allChats   = await messages.get( hasFilters ? filterObject : undefined )

			if ( format === 'json' ) {

				console.log( JSON.stringify( allChats ) )

			}
			else {

				console.log( infoStyle( [ 'Total Chats:', `${allChats.length}` ] ) )

				if ( allChats.length === 0 ) return

				const formattedList = allChats.map( ( chat, index ) => {

					return [
						` ${index + 1}. [${chat.name || chat.participants[0] || chat.id}]`,
						`    • ID           : ${chat.id}`,
						`    • Name         : ${chat.name || '-'}`,
						`    • Participants : ${chat.participants.join( ', ' ) || '-'}`,
						`    • Service      : ${chat.service}`,
					].join( '\n' )

				} ).join( '\n\n' )

				console.log( `\n${formattedList}\n` )

			}

		}
		// 4. READ MESSAGES
		else if ( argv.existsCmd( CMD.MESSAGES ) ) {

			const chatId = ( argv.getCmdValues( CMD.MESSAGES ) || [] )[0]
			if ( !chatId ) {

				console.log( errorStyle( `Please specify a chat id. Example: messages messages "iMessage;-;+angel@pigeonposse.com"` ) )
				return

			}

			const limitRaw = argv.getFlagValue( 'limit' ) || argv.getFlagValue( 'l' )
			const limit    = limitRaw && !isNaN( parseInt( limitRaw, 10 ) ) ? parseInt( limitRaw, 10 ) : undefined

			const msgs = await messages.getMessages( chatId, limit ? { limit } : {} )

			if ( msgs.length === 0 ) {

				console.log( infoStyle( [ 'Messages:', 'none found' ] ) )
				return

			}

			const formattedList = msgs.map( ( msg, index ) => {

				return [
					` ${index + 1}. ${msg.content}`,
					`    • Date : ${msg.date}`,
					`    • ID   : ${msg.id}`,
				].join( '\n' )

			} ).join( '\n\n' )

			console.log( infoStyle( [ 'Total Messages:', `${msgs.length}` ] ) )
			console.log( `\n${formattedList}\n` )

		}
		// 5. LIST SERVICES
		else if ( argv.existsCmd( CMD.SERVICES ) ) {

			const format   = argv.getFlagValue( 'res' ) || argv.getFlagValue( 'r' ) || 'text'
			const services = await messages.getServices()

			if ( format === 'json' ) {

				console.log( JSON.stringify( services ) )

			}
			else {

				console.log( infoStyle( [ 'Total Services:', `${services.length}` ] ) )

				if ( services.length === 0 ) return

				const formattedList = services.map( ( service, index ) => {

					return [
						` ${index + 1}. [${service.name || service.id}]`,
						`    • ID          : ${service.id}`,
						`    • Name        : ${service.name || '-'}`,
						`    • ServiceType : ${service.serviceType || '-'}`,
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
	Messages,
}
