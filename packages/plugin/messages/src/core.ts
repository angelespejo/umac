/* eslint-disable jsdoc/require-returns */
import { exec } from '@umac-js/utils'

class MessagesSuper {

	protected async _exec( cmd: string ) {

		const {
			stderr,
			stdout,
		} = await exec( cmd )

		if ( stderr ) throw new Error( stderr.toString() )
		return stdout.toString()

	}

	protected async _executeAppleScript( script: string ) {

		return await this._exec( `osascript -e '${script.replace( /'/g, '\'\\\'\'' )}'` )

	}

	protected _escape( value: string ) {

		return value
			.replace( /\\/g, '\\\\' )
			.replace( /"/g, '\\"' )

	}

	protected async _getServiceInfoFromDB(): Promise<Map<string, AppleServiceInfo>> {

		const info = new Map<string, AppleServiceInfo>()

		try {

			const query = 'SELECT account_id, service_name, account_login FROM chat WHERE account_id IS NOT NULL GROUP BY account_id, service_name, account_login'
			const raw   = await this._exec( `sqlite3 ~/Library/Messages/chat.db "${query}"` )

			for ( const line of raw.split( '\n' ) ) {

				if ( !line.trim() ) continue

				const [
					accountId,
					serviceName,
					login,
				] = line.split( '|' )

				if ( !accountId || !serviceName ) continue

				const name = login ? login.replace( /^[EP]:/, '' ) : serviceName
				info.set( accountId, {
					name,
					serviceType : serviceName,
				} )

			}

		}
		catch {
			// Sin acceso a la base de datos (permisos) o sqlite3 no disponible: degradación silenciosa
		}

		return info

	}

}

type AppleChatObject = {
	id           : string
	name         : string
	participants : string[]
	service      : string
}

type AppleChatObjectFilter = {
	[K in keyof AppleChatObject]?: AppleChatObject[K] | string[]
}

type AppleServiceObject = {
	id          : string
	name        : string
	serviceType : string
}

type AppleServiceInfo = {
	name        : string
	serviceType : string
}

type AppleMessageObject = {
	id      : string
	content : string
	date    : string
}

export class Messages extends MessagesSuper {

	CODE = {
		SUCCESS            : 'success',
		ERROR_NONE_PARAMS  : 'error-none-params',
		ERROR_NONE_MESSAGE : 'error-none-message',
		ERROR_NONE_CHAT    : 'error-none-chat',
		ERROR_NONE_BUDDY   : 'error-none-buddy',
		ERROR_NONE_SERVICE : 'error-none-service',
		ERROR_NOT_MACOS    : 'error-not-macos',
	} as const

	#setResult( result: string ) {

		if ( result.startsWith( 'error' ) ) throw new Error( result )
		return

	}

	/**
	 * Retrieves the list of services configured in Messages.
	 *
	 * @returns {Promise<Array<AppleServiceObject>>} Resolves to an array of services with their id, name and service type.
	 * @example
	 * ```typescript
	 * const services = await messages.getServices()
	 * ```
	 */
	async getServices(): Promise<Array<AppleServiceObject>> {

		const script = `tell application "Messages"
            set serviceIds to id of every service
            set serviceNames to {}
            set serviceTypes to {}
            try
                set serviceNames to name of every service
            end try
            try
                set serviceTypes to service type of every service
            end try
            set totalServices to count of serviceIds
            set resultList to {}
            repeat with i from 1 to totalServices
                set serviceId to item i of serviceIds
                set serviceName to ""
                if (count of serviceNames) >= i then
                    set serviceName to item i of serviceNames
                    if serviceName is missing value then set serviceName to ""
                end if
                set serviceType to ""
                if (count of serviceTypes) >= i then
                    set serviceType to item i of serviceTypes
                    if serviceType is missing value then set serviceType to ""
                end if
                set end of resultList to serviceId & "|||" & serviceName & "|||" & serviceType
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

		const services = rawResult.split( '&&&' ).map( serviceStr => {

			const [
				id,
				name,
				serviceType,
			] = serviceStr.split( '|||' )

			return {
				id,
				name,
				serviceType,
			}

		} )

		// En macOS 26.x AppleScript ya no expone el nombre ni el tipo de servicio.
		// Se completa desde chat.db (metadatos de cuenta, no historial).
		const dbInfo = await this._getServiceInfoFromDB()

		if ( dbInfo.size > 0 ) {

			for ( const service of services ) {

				const info = dbInfo.get( service.id )
				if ( !info ) continue

				if ( !service.name ) service.name = info.name
				if ( !service.serviceType ) service.serviceType = info.serviceType

			}

		}

		return services

	}

	/**
	 * Retrieves the currently open chats in Messages.
	 *
	 * @param   {AppleChatObjectFilter | AppleChatObjectFilter[]} [filter] - Optional single filter criteria or array of filter objects (OR logic).
	 * @returns {Promise<Array<AppleChatObject>>}                          Resolves to an array of chat objects.
	 * @example
	 * ```typescript
	 * // 1. Retrieve all open chats (no filter)
	 * const allChats = await messages.get()
	 *
	 * // 2. Filter by partial name match
	 * const workChats = await messages.get( { name: 'Work' } )
	 *
	 * // 3. Filter by participant handle
	 * const byContact = await messages.get( { participants: [ '+34607789798' ] } )
	 *
	 * // 4. Filter using multiple criteria objects (OR logic)
	 * const results = await messages.get( [
	 *   { name: 'Work' },
	 *   { participants: [ 'work@mail.com' ] }
	 * ] )
	 * ```
	 */
	async get( filter?: AppleChatObjectFilter | AppleChatObjectFilter[] ): Promise<Array<AppleChatObject>> {

		const script = `tell application "Messages"
            set chatIds to id of every chat
            set chatNames to name of every chat
            set chatAccounts to id of account of every chat
            set totalChats to count of chatIds
            
            set resultList to {}
            
            repeat with i from 1 to totalChats
                set chatId to item i of chatIds
                set chatName to item i of chatNames
                if chatName is missing value then set chatName to ""
                set chatAccount to item i of chatAccounts
                
                set participantHandles to handle of participants of chat id chatId
                set participantStr to ""
                if (count of participantHandles) > 0 then
                    set oldDelims to my text item delimiters
                    set my text item delimiters to "///"
                    set participantStr to participantHandles as string
                    set my text item delimiters to oldDelims
                end if
                
                set chatData to chatId & "|||" & chatName & "|||" & participantStr & "|||" & chatAccount
                set end of resultList to chatData
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

		const allChats = rawResult.split( '&&&' ).map( chatStr => {

			const [
				id,
				name,
				participantStr,
				service,
			] = chatStr.split( '|||' )
			const participants = participantStr ? participantStr.split( '///' ) : []

			return {
				id,
				name,
				participants,
				service,
			}

		} )

		if ( !filter ) return allChats

		const filters = Array.isArray( filter ) ? filter : [ filter ]
		if ( filters.length === 0 ) return allChats

		const matchSingleFilter = ( chat: AppleChatObject, f: AppleChatObjectFilter ): boolean => {

			// 1. Filtrado por ID
			if ( f.id ) {

				const ids = Array.isArray( f.id ) ? f.id : [ f.id ]
				if ( !ids.includes( chat.id ) ) return false

			}

			// 2. Filtrado por Nombre (soporta substrings y array de nombres)
			if ( f.name ) {

				const names       = Array.isArray( f.name ) ? f.name : [ f.name ]
				const matchesName = names.some( n => chat.name.toLowerCase().includes( n.toLowerCase() ) )
				if ( !matchesName ) return false

			}

			// 3. Filtrado por participantes
			if ( f.participants ) {

				const raw = Array.isArray( f.participants ) ? f.participants : [ f.participants ]

				if ( Array.isArray( raw[0] ) ) {

					// Array de grupos: todos los handles de una combinación deben estar presentes
					const targetCombos = raw as unknown as string[][]
					const matchesGroup = targetCombos.some( combo =>
						combo.every( handle => chat.participants.includes( handle ) ),
					)
					if ( !matchesGroup ) return false

				}
				else {

					// Un solo grupo de handles: basta con que uno coincida
					const targetHandles = raw as string[]
					if ( !targetHandles.some( handle => chat.participants.includes( handle ) ) ) return false

				}

			}

			// 4. Filtrado por servicio (id de la cuenta)
			if ( f.service ) {

				const services = Array.isArray( f.service ) ? f.service : [ f.service ]
				if ( !services.includes( chat.service ) ) return false

			}

			return true

		}

		return allChats.filter( chat => filters.some( f => matchSingleFilter( chat, f ) ) )

	}

	/**
	 * Retrieves the messages of a chat.
	 *
	 * @param   {string}                             [chatId]        - The chat id (GUID). Required.
	 * @param   {object}                             [options]       - Additional options.
	 * @param   {number}                             [options.limit] - Maximum number of messages to return.
	 * @returns {Promise<Array<AppleMessageObject>>}                 Resolves to an array of message objects.
	 * @example
	 * ```typescript
	 * const messages = await messages.getMessages( 'iMessage;-;+34607789798' )
	 * const recent   = await messages.getMessages( 'iMessage;-;+34607789798', { limit: 10 } )
	 * ```
	 */
	async getMessages( chatId: string, options: { limit?: number } = {} ): Promise<Array<AppleMessageObject>> {

		if ( !chatId ) throw new Error( this.CODE.ERROR_NONE_PARAMS )

		const limit = options.limit ?? Number.POSITIVE_INFINITY

		const script = `tell application "Messages"
            set chatMessages to messages of chat id "${this._escape( chatId )}"
            set totalMsg to count of chatMessages
            set resultList to {}
            repeat with i from 1 to totalMsg
                set m to item i of chatMessages
                set mId to id of m
                set mContent to content of m
                set mDate to date received of m as string
                set end of resultList to mId & "|||" & mContent & "|||" & mDate
            end repeat
            set oldDelims to my text item delimiters
            set my text item delimiters to "&&&"
            set finalOutput to resultList as string
            set my text item delimiters to oldDelims
            return finalOutput
        end tell`

		let rawResult: string
		try {

			rawResult = await this._executeAppleScript( script )

		}
		catch ( e ) {

			throw new Error( `${( e as Error ).message}. Note: reading messages requires a macOS version where Messages exposes the "messages" element via AppleScript (unavailable on macOS 26.x).`, { cause: e } )

		}

		this.#setResult( rawResult )

		if ( !rawResult ) return []

		const allMessages = rawResult.split( '&&&' ).map( msgStr => {

			const [
				id,
				content,
				date,
			] = msgStr.split( '|||' )

			return {
				id,
				content,
				date,
			}

		} )

		return Number.isFinite( limit ) ? allMessages.slice( -limit ) : allMessages

	}

	/**
	 * Sends a message through Messages.
	 *
	 * @param {string} [target]          - Buddy handle (email/phone) or chat id (GUID). Chats are auto-detected when the value contains ";" (e.g. "iMessage;-;+34607789798").
	 * @param {string} [message]         - The text to send.
	 * @param {object} [options]         - Additional options.
	 * @param {string} [options.service] - Optional service id to send through (only used for buddy targets).
	 * @example
	 * ```typescript
	 * // Send to a buddy by handle
	 * await messages.send( '+34607789798', 'Hola!' )
	 *
	 * // Send to a specific chat by id
	 * await messages.send( 'iMessage;-;+34607789798', 'Hola!' )
	 * ```
	 */
	async send( target: string, message: string, options: { service?: string } = {} ) {

		if ( !target || !message ) return this.#setResult( this.CODE.ERROR_NONE_PARAMS )

		const isChatId = target.includes( ';' )

		const script = isChatId
			? `tell application "Messages"
            send "${this._escape( message )}" to chat id "${this._escape( target )}"
        end tell`
			: `tell application "Messages"
            send "${this._escape( message )}" to buddy "${this._escape( target )}"${options.service ? ` of service "${this._escape( options.service )}"` : ''}
        end tell`

		await this._executeAppleScript( script )
		return this.CODE.SUCCESS

	}

	/**
	 * Opens the Messages application.
	 *
	 * @example
	 * ```typescript
	 * await messages.open()
	 * ```
	 */
	async open() {

		const script = `tell application "Messages" to activate`
		await this._executeAppleScript( script )
		return this.CODE.SUCCESS

	}

}
