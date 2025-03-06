import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'

const CONSTS = await getWorkspaceConfig( {
	metaURL  : import.meta.url,
	path     : '../',
	corePath : './packages/umac',
} )

export default CONSTS
