import { Models } from '@rematch/core'
import { application } from './application'
export interface RootModel extends Models<RootModel> {
  application: typeof application
}
export const models: RootModel = { application }
