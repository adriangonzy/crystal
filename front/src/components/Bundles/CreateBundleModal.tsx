import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Input } from '../Input/Input'
import { TransactionForm } from '../TransactionForm/TransactionForm'
import { useStore } from './useBundles'

type BundleFormData = {
  title: string
}

export const CreateBundleModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const { addBundle } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BundleFormData>()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10 "
        onClose={() => setIsOpen(false)}
      >
        <div className="px-4 min-h-screen text-center text-purple-700">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            afterLeave={() => navigate('/bundles')}
          >
            <div
              className="inline-block overflow-auto py-4 px-6 w-full max-w-lg text-left align-middle 
            bg-white bg-opacity-90 rounded-xl shadow-xl transition-all transform border-2 border-white"
            >
              <button
                className="absolute top-4 right-4 text-2xl hover:text-purple-700"
                onClick={() => setIsOpen(false)}
              >
                <MdClose />
              </button>
              <Dialog.Title as="h3" className="text-2xl font-medium leading-6">
                New bundle
              </Dialog.Title>
              <div className="mt-2">
                <form>
                  <Input
                    type="text"
                    label="Title*"
                    {...register('title', {
                      required: true,
                    })}
                    error={errors.title}
                    errorMessage="Required"
                    defaultValue={`New Bundle`}
                  />
                </form>
                <TransactionForm
                  submitLabel="Add Bundle"
                  getMaxBaseFee={async () => 0}
                  onSubmit={(tx, signer) => {
                    handleSubmit((data: BundleFormData) => {
                      addBundle({
                        title: data.title,
                        transactions: [
                          {
                            transaction: tx,
                            signer,
                          },
                        ],
                      })
                    })()
                    navigate('/bundles')
                  }}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
