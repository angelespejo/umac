
import { helpOut } from './print'

const helpMessage = helpOut( {
	title   : 'devtool',
	desc    : 'A command-line tool for developers to manage projects, environments, and deployments.',
	helpURL : 'https://docs.devtool.com',
	cmds    : [
		{
			value : 'project',
			desc  : 'Manage projects.',
			cmds  : [
				{
					value      : 'create',
					desc       : 'Create a new project.',
					posicional : 'project-name',
				},
				{
					value      : 'delete',
					desc       : 'Delete an existing project.',
					posicional : 'project-name',
				},
			],
		},
		{
			value : 'env',
			desc  : 'Manage environments.',
			cmds  : [
				{
					value : 'list',
					desc  : 'List all available environments.',
				},
				{
					value      : 'set',
					desc       : 'Set an environment variable.',
					posicional : 'KEY=VALUE',
				},
				{
					value      : 'unset',
					desc       : 'Remove an environment variable.',
					posicional : 'KEY',
				},
			],
		},
		{
			value : 'deploy',
			desc  : 'Deploy the application.',
			cmds  : [
				{
					value      : 'server',
					desc       : 'Deploy to a specific server.',
					posicional : 'server-name',
					flags      : [
						{
							value : '--env',
							desc  : 'Specify the environment (dev, staging, prod).',
						},
						{
							value : '--force',
							desc  : 'Force deployment without confirmation.',
						},
					],
				},
				{
					value      : 'rollback',
					desc       : 'Rollback the last deployment.',
					posicional : 'version',
				},
			],
		},
	],
	cmdsDesc : 'Use \'devtool <command> --help\' for more details on each command.',
	flags    : [
		{
			value : '--verbose',
			desc  : 'Display additional output details.',
		},
		{
			value : '--config',
			desc  : 'Specify a custom configuration file.',
		},
	],
	flagsDesc    : 'Flags can be used with any command.',
	flagsGeneral : [
		{
			value : '-v, --version',
			desc  : 'Show the tool version.',
		},
		{
			value : '-h, --help',
			desc  : 'Display this help message.',
		},
	],
	flagsGeneralDesc : 'Global flags applicable to any command.',
	examples         : [
		{
			value : '$0 project create my-app',
			desc  : 'Creates a new project named \'my-app\'.',
		},
		{
			value : '$0 env set NODE_ENV=production',
			desc  : 'Sets an environment variable for production.',
		},
		{
			value : '$0 deploy server my-server --env=prod --force',
			desc  : 'Deploys the application to \'my-server\' in production without confirmation.',
		},
		{
			value : '$0 deploy rollback 1.2.3',
			desc  : 'Rolls back to deployment version 1.2.3.',
		},
	],
	examples$0 : 'devtool',
} )

console.log( helpMessage )
