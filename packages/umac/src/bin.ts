#!/usr/bin/env node

import cli         from './main'
import { updater } from './up'

await cli.run()
await updater()
