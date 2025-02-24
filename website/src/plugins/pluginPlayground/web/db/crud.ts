import { id, lookup } from '@instantdb/react'
import type { PlaygroundProps } from '../../shared/types'
import { db } from './db'
import { makeId } from '../utils/makeId'

type CreateSnippetParams = {
  forkedFromId?: string
  files: PlaygroundProps['files']
}

export function createSnippet(params: CreateSnippetParams) {
  const { forkedFromId, files } = params
  const snippetId = makeId()

  db.transact(
    db.tx.files[id()].update({
      snippetId,
      forkedFromId,
      filesJson: JSON.stringify(files),
      createdAt: new Date().toISOString(),
    })
  )

  return snippetId
}

type UpdateSnippetParams = {
  snippetId: string
  files: PlaygroundProps['files']
}

export function updateSnippet(params: UpdateSnippetParams) {
  const { snippetId, files } = params

  db.transact(
    db.tx.files[lookup('snippetId', snippetId)].merge({
      filesJson: JSON.stringify(files),
      updatedAt: new Date().toISOString(),
    })
  )
}
