import { Models } from '@rematch/core'
import { application } from './application'
import { evmCompatibles } from './evmcompatibles'
import { cosmosCompatibles } from './cosmoscompatibles'
export interface RootModel extends Models<RootModel> {
  application: typeof application
  evmCompatibles: typeof evmCompatibles
  cosmosCompatibles: typeof cosmosCompatibles
}
export const models: RootModel = { application, evmCompatibles, cosmosCompatibles }
