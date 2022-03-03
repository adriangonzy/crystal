import { TransactionRequest } from '@usedapp/core/node_modules/@ethersproject/providers'
import produce, { Draft } from 'immer'
import create, {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand'
import { persist } from 'zustand/middleware'

export interface StoredTx {
  signer?: string
  transaction: TransactionRequest
}

export interface StoredBundle {
  id: string
  title: string
  transactions: StoredTx[]
}

export type CreateStoredBundle = Omit<StoredBundle, 'id'> & { id?: string }

const immer =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<
      T,
      (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
      CustomGetState,
      CustomStoreApi
    >
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T)
        return set(nextState, replace)
      },
      get,
      api
    )

type BundleStoreState = {
  bundles: StoredBundle[]
  addBundle: (bundle: CreateStoredBundle) => void
  removeBundle: (id: string) => void
  addTransaction: (id: string, tx: StoredTx) => void
  removeTransaction: (id: string, index: number) => void
}

const find = (state: BundleStoreState, id: string) =>
  state.bundles.findIndex((e: StoredBundle) => e.id === id)

export const useBundles = create<BundleStoreState>(
  persist(
    immer((set) => ({
      bundles: new Array<StoredBundle>(),
      addBundle: (bundle: CreateStoredBundle) =>
        set((state) => {
          state.bundles.push({ ...bundle, id: Date.now() + '' })
        }),
      removeBundle: (id: string) =>
        set((state) => {
          state.bundles.splice(find(state, id), 1)
        }),
      addTransaction: (id: string, tx: StoredTx) =>
        set((state) => {
          state.bundles[find(state, id)].transactions.push(tx)
        }),
      removeTransaction: (id: string, index: number) =>
        set((state) => {
          state.bundles[find(state, id)].transactions.splice(index, 1)
        }),
    })),
    {
      name: 'bundles',
      partialize: (state) => ({ bundles: state.bundles }),
    }
  )
)
