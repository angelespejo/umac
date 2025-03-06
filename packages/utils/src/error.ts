/**
 * Catches errors from a promise and returns a tuple indicating success or failure.
 * @template T - The type of the resolved value of the promise.
 * @param {Promise<T>} promise - The promise to handle errors for.
 * @returns {Promise<[undefined, T] | [Error]>} A promise that resolves to a tuple.
 *          The tuple contains either `[undefined, T]` if the promise is resolved successfully,
 *          or `[Error]` if an error occurs.
 */
export const catchError = async <T>( promise: Promise<T> ): Promise<[undefined, T] | [Error]> => {

	return promise
		.then( value => ( [ undefined, value ] as unknown as [undefined, T] ) )
		.catch( error => ( [ error ] ) )

}

/**
 * A generic error class that extends the native `Error` class to include
 * additional contextual data.
 *
 * This class is useful for creating strongly-typed errors in TypeScript, allowing
 * you to provide structured data along with the error message for improved error handling.
 *
 * ---
 * @template M - The type of the error message. Defaults to `string`.
 * @template D - The type of the additional data associated with the error. Defaults to `undefined`.
 * @example
 * // Basic usage with a string message
 *
 * const error = new TypedError('Something went wrong');
 * console.error(error.message); // "Something went wrong"
 * @example
 * // Usage with additional data
 *
 * const error = new TypedError('Validation failed', { field: 'email', reason: 'invalid' });
 * console.error(error.message); // "Validation failed"
 * console.error(error.data); // { field: 'email', reason: 'invalid' }
 * @example
 * // Usage in a try-catch block
 *
 * try {
 *   throw new TypedError('Database connection failed', { host: 'localhost', port: 5432 });
 * } catch (err) {
 *   if (err instanceof TypedError) {
 *     console.error(`Error: ${err.message}`);
 *     console.error('Error Data:', err.data);
 *   }
 * }
 * @example
 * // Custom error class With TypeScript and specific data type
 *
 * const ERRORS = ['unexpected', 'validation', 'database'] as const;
 * class AppError extends TypedError<typeof ERRORS[number], { user: string }> {}
 *
 * const successError = new AppError( 'validation', { user: 'username' } );
 * const failError = new AppError( 'not-exist', { user: 'username' } );  // Must be fail because message not exist
 * const failError2 = new AppError( 'unexpected', { key: 'username' } ); // Must be fail because data not match
 */
export class TypedError<M extends string = string, D = undefined> extends Error {

	data : D | undefined

	constructor( message: M, data?: D ) {

		super( message )
		this.data = data
		// @ts-ignore
		Error.captureStackTrace( this, this.constructor ) // Captura el stack trace

	}

}
