import { Disclosure } from '@headlessui/react'
import { CgChevronDownR, CgTrashEmpty } from 'react-icons/cg'
import { StoredTx } from '../Bundles/useBundles'
import { useDefaultSigner } from '../Bundles/useDefaultSigner'

export interface TransactionItemProps {
  name: string
  tx: StoredTx
  onRemove?: (tx: StoredTx) => void
}

export const Address = ({
  label,
  address,
}: {
  label: string
  address: string
}) => {
  return (
    <span className="inline-block overflow-hidden text-ellipsis max-w-[150px]">
      <a
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="mr-2 italic">{label}</span>
        <span className="hover:underline">{address}</span>
      </a>
    </span>
  )
}

export const TransactionItem = ({
  tx,
  name,
  onRemove,
}: TransactionItemProps) => {
  const defaultSigner = useDefaultSigner()

  return (
    <div className="p-4 my-4 bg-white bg-opacity-60 rounded-lg border border-white">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex flex-row justify-between items-center w-full text-left">
              {name}
              <Address address={tx.signer ?? defaultSigner} label="from" />
              <Address
                address={'transaction' in tx ? tx.transaction?.to ?? '' : ''}
                label="to"
              />
              <CgChevronDownR
                className={`text-2xl hover:fill-red-500 ${
                  open ? 'transform rotate-180' : ''
                }`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="flex flex-col">
              <pre className="p-4 my-4 text-white bg-black rounded-lg shadow-inner shadow-gray-500">
                {JSON.stringify(tx.transaction, null, 2)}
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
}
