import { Dialog, Transition } from '@headlessui/react'
import { Fragment, PropsWithChildren, useState } from 'react'
import { MdClose } from 'react-icons/md'

export interface ModalProps {
  title?: string
  afterLeave?: () => void
  onClose?: () => void
  isOpen?: boolean
}

export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const [isOpen, setIsOpen] = useState(true)
  const defaultOnClose = () => setIsOpen(false)
  return (
    <Transition appear show={props.isOpen ?? isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10 "
        onClose={props.onClose ?? defaultOnClose}
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
            afterLeave={props.afterLeave}
          >
            <div
              className="inline-block overflow-auto py-4 px-6 w-full max-w-lg text-left align-middle 
            bg-white bg-opacity-90 rounded-xl shadow-xl transition-all transform border-2 border-white"
            >
              <button
                className="absolute top-4 right-4 text-2xl hover:text-purple-700"
                onClick={props.onClose ?? defaultOnClose}
              >
                <MdClose />
              </button>
              {props.title && (
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6"
                >
                  {props.title}
                </Dialog.Title>
              )}
              <div className="mt-2">{props.children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
