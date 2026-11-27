import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validLibreMetadata } from '../../src/fiches/libre-metadata.ts'

const page = { domain: 'algèbre', exerciseType: 'addition-ligne', libreId: 'addition-a' }
const item = { layout: 'inline', answer: '42', libreId: 'question-a', libreLocked: true }

test('les anciennes recettes et les questions identifiées sont compatibles', () => {
  assert(validLibreMetadata([{ domain: 'algèbre', exerciseType: 'addition-ligne' }]))
  assert(validLibreMetadata([{ ...page, libreItems: [item] }]))
  assert(validLibreMetadata([{ ...page, libreItems: [item], extraBlocks: [{ libreId: 'addition-b', libreItems: [item] }] }]))
})

test('les verrous et les identités incohérentes sont refusés', () => {
  assert(!validLibreMetadata([{ ...page, libreItems: [item, item] }]))
  assert(!validLibreMetadata([{ ...page, libreItems: [{ ...item, libreId: undefined }] }]))
  assert(!validLibreMetadata([{ ...page, libreItems: [{ ...item, libreLocked: 'oui' }] }]))
  assert(!validLibreMetadata([{ ...page, libreId: undefined, libreItems: [item] }]))
  assert(!validLibreMetadata([{ ...page, extraBlocks: [page] }]))
})
