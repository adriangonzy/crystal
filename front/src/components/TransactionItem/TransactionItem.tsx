import {
  FlashbotsBundleRawTransaction,
  FlashbotsBundleTransaction,
} from '@flashbots/ethers-provider-bundle'
import { Disclosure } from '@headlessui/react'
import { CgChevronDownR, CgTrashEmpty } from 'react-icons/cg'

export interface TransactionItemProps {
  name: string
  tx: FlashbotsBundleTransaction | FlashbotsBundleRawTransaction
  onRemove?: (
    tx: FlashbotsBundleTransaction | FlashbotsBundleRawTransaction
  ) => void
}

export const TransationItem = ({
  tx,
  name,
  onRemove,
}: TransactionItemProps) => (
  <div className="p-4 my-4 bg-white bg-opacity-80 rounded-lg border border-black">
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-row items-center w-full">
            <span className="flex-1 text-left">{name}</span>

            <CgChevronDownR
              className={`text-2xl hover:fill-red-500 ${
                open ? 'transform rotate-180' : ''
              }`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="flex flex-col">
            <pre className="p-4 my-4 text-white bg-black rounded-lg shadow-inner shadow-gray-500">
              {JSON.stringify(
                'signedTransaction' in tx
                  ? tx.signedTransaction
                  : 'transaction' in tx
                  ? tx.transaction
                  : 'invalid transaction',
                null,
                2
              )}
            </pre>
            <div className="flex flex-row justify-end">
              <button
                className="flex flex-row p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg border-2 border-red-500"
                onClick={() => onRemove?.(tx)}
              >
                <CgTrashEmpty className="mx-2 text-2xl" />
                <span className="">Remove</span>
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>
)
