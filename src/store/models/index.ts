import { Models } from '@rematch/core'
import { application } from './application'
import { evmCompatibles } from './evmcompatibles'
import { comoscompatibles } from './comoscompatibles'
export interface RootModel extends Models<RootModel> {
  application: typeof application
  evmCompatibles: typeof evmCompatibles
  comoscompatibles: typeof comoscompatibles
}
export const models: RootModel = { application, evmCompatibles, comoscompatibles }
