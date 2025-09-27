import { CliCore } from './_shared'
import { Screen }  from './screen'

const screen = new Screen()

export const cliScreen: CliCore = {
	cmd : {
		value : 'screen',
		desc  : 'Capture screenshots or record screen videos',
		cmds  : [
			{
				value : 'capture',
				desc  : 'Capture a screenshot',
				flags : [
					{
						value : '--output, -o',
						desc  : 'Path to save the screenshot',
					},
					{
						value : '--mode',
						desc  : 'Capture mode: fullScreen (default), window, interactive, or region: x,y,w,h',
					},
					{
						value : '--format',
						desc  : 'Image format: png (default), jpg, tiff, pdf',
					},
					{
						value : '--include-cursor',
						desc  : 'Include mouse cursor',
					},
					{
						value : '--shadow',
						desc  : 'Include window shadow.',
					},
					{
						value : '--silent',
						desc  : 'Suppress camera sound',
					},
					{
						value : '--preview',
						desc  : 'Open in Preview after capture',
					},
					{
						value : '--delay',
						desc  : 'Delay before capture (seconds)',
					},
					{
						value : '--show-ui',
						desc  : 'Show UI after capture',
					},
				],
				examples : [
					{
						value : '$0 screen capture -o ./screenshot.png',
						desc  : 'Capture full screen to screenshot.png',
					},
					{
						value : '$0 screen capture -o ./region.png --mode 100,100,400,300',
						desc  : 'Capture a 400x300 region at (100,100)',
					},
					{
						value : '$0 screen capture --output ./window.png --mode window',
						desc  : 'Capture a window (requires interaction)',
					},
				],
			},
			{
				value : 'record',
				desc  : 'Record a screen video',
				flags : [
					{
						value : '--output',
						desc  : 'Path to save the video',
					},
					{
						value : '--mode',
						desc  : 'Capture mode: fullScreen (default) or region: x,y,w,h',
					},
					{
						value : '--format',
						desc  : 'Video format: mov (default), mp4',
					},
					{
						value : '--video-duration',
						desc  : 'Duration of the video (in seconds)',
					},
					{
						value : '--audio',
						desc  : 'Enable audio recording. Default: false',
					},
					{
						value : '--audio-device-id',
						desc  : 'Audio device ID to record from',
					},
					{
						value : '--show-clicks',
						desc  : 'Show mouse clicks during recording',
					},
					{
						value : '--include-cursor',
						desc  : 'Include mouse cursor',
					},
					{
						value : '--silent',
						desc  : 'Suppress sound',
					},
					{
						value : '--preview',
						desc  : 'Open after recording',
					},
					{
						value : '--delay',
						desc  : 'Delay before starting (seconds)',
					},
				],
				examples : [
					{
						value : '$0 screen record --output ./video.mov --videoDuration 10',
						desc  : 'Record a 10s screen video',
					},
					{
						value : '$0 screen record --output ./area.mov --mode 0,0,800,600 --showClicks',
						desc  : 'Record an 800x600 region and show clicks',
					},
				],
			},
		],
	},

	fn : async ( {
		argv, getHelp,
	} ) => {

		const modeFlag = argv.getFlagValue( 'mode' )
		const mode     = !modeFlag
			? 'fullScreen' as const
			: modeFlag === 'window' || modeFlag === 'interactive' as const
				? modeFlag
				: modeFlag.split( ',' ).map( n => parseInt( n.trim(), 10 ) ) as [ number, number, number, number ]

		const getNumbValue = ( value: string ) => {

			const numb = argv.getFlagValue( value )
			if ( !numb ) return
			return Number( numb )

		}
		const getOutput = () => {

			const outputPath = argv.getFlagValue( 'output' ) || argv.getFlagValue( 'o' )
			if ( !outputPath ) throw new Error( 'Missing required --output or -o flag' )
			return outputPath

		}
		if ( argv.existsCmd( 'capture' ) ) {

			const options = {
				mode,
				format        : argv.getFlagValue( 'format' ),
				includeCursor : argv.existsFlag( 'include-cursor' ),
				shadow        : argv.getFlagValue( 'shadow' ) !== 'false',
				silent        : argv.getFlagValue( 'silent' ) !== 'false',
				preview       : argv.existsFlag( 'preview' ),
				delay         : getNumbValue( 'delay' ),
				showUI        : argv.existsFlag( 'show-ui' ),
			} as const
			console.log( await screen.capture( getOutput(), options ) )

		}
		else if ( argv.existsCmd( 'record' ) ) {

			if ( mode === 'interactive' ) throw new Error( 'Interactive mode is not supported for record command' )
			if ( mode === 'window' ) throw new Error( 'Window mode is not supported for record command' )

			await screen.record( getOutput(), {
				mode,
				format        : argv.getFlagValue( 'format' ),
				videoDuration : getNumbValue( 'video-duration' ),
				audio         : argv.existsFlag( 'audio' ),
				audioDeviceId : getNumbValue( 'audio-device-id' ),
				showClicks    : argv.existsFlag( 'show-clicks' ),
				includeCursor : argv.existsFlag( 'include-cursor' ),
				silent        : argv.getFlagValue( 'silent' ) !== 'false',
				preview       : argv.existsFlag( 'preview' ),
				delay         : getNumbValue( 'delay' ),
			} )

		}
		else {

			console.log( await getHelp() )

		}

	},
}
