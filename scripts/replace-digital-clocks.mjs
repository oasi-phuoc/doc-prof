#!/usr/bin/env node
// Historical entry point retained for the shared analog-clock renderer.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
// The former optional Playwright module path is no longer needed.
if (args[0] && !args[0].startsWith('--')) args.shift()
const result = spawnSync('python3', [resolve(root, 'scripts/render_tcf_clocks.py'), ...args], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)
