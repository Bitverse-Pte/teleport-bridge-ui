import { Models } from '@rematch/core'
import { application } from './application'
import { evmCompatibles } from './evmcompatibles'
export interface RootModel extends Models<RootModel> {
  application: typeof application
  evmCompatibles: typeof evmCompatibles
}
export const models: RootModel = { application, evmCompatibles }
