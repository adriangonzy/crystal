import { Disclosure } from '@headlessui/react'
import { CgChevronDownR, CgMathPlus, CgTrashEmpty } from 'react-icons/cg'
import { FiSend } from 'react-icons/fi'
import { ImLab } from 'react-icons/im'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button/Button'
import { TransactionItem } from '../TransactionItem/TransactionItem'
import { StoredBundle, useBundles } from './useBundles'
import { useFlashbots } from './useFlashbots'

export interface BundleProps {
  bundle: StoredBundle
}

export const Bundle: React.FunctionComponent<BundleProps> = ({ bundle }) => {
  const navigate = useNavigate()
  const { bundles, removeBundle, removeTransaction } = useBundles()
  const { simulateBundle } = useFlashbots()

  const openLastByDefault = bundles[bundles.length - 1].id === bundle.id

  return (
    <div className="p-4 bg-white bg-opacity-30 rounded-lg border-2 border-white">
      <Disclosure defaultOpen={openLastByDefault}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex flex-row items-center w-full">
              <span className="flex-1 text-lg font-bold text-left">
                {bundle.title}
              </span>

              <CgChevronDownR
                className={`text-2xl hover:fill-red-500 ${
                  open ? 'transform rotate-180' : ''
                }`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="flex flex-col">
              <div className="mt-4 border border-white " />
              <div className="overflow-scroll flex-1 py-4 no-scroll-bars">
                {bundle.transactions.map((tx, i) => (
                  <TransactionItem
                    name={`Tx #${i}`}
                    tx={tx}
                    key={i}
                    onRemove={() => removeTransaction(bundle.id, i)}
                  />
                ))}
                {bundle.transactions.length === 0 && (
                  <div className="text-center">
                    No transactions added to bundle
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-end space-x-4 flex-2 min-h-24">
                <Button
                  onClick={() => removeBundle(bundle.id)}
                  className="hover:bg-pink-500"
                  icon={<CgTrashEmpty />}
                ></Button>
                <Button
                  onClick={() => navigate(`/bundles/${bundle.id}/add`)}
                  className="hover:bg-emerald-500"
                  icon={<CgMathPlus />}
                >
                  Add Transaction
                </Button>
                <Button
                  onClick={() => simulateBundle(bundle)}
                  className="hover:bg-teal-500"
                  icon={<ImLab />}
                >
                  Simulate
                </Button>
                <Button onClick={() => alert('TODO')} icon={<FiSend />}>
                  Send
                </Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
