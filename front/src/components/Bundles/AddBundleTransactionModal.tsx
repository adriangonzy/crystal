import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../Modal/Modal'
import { TransactionForm } from '../TransactionForm/TransactionForm'
import { useBundles } from './useBundles'

export const AddBundleTransactionModal = () => {
  const navigate = useNavigate()
  const { bundleId } = useParams<{ bundleId: string }>()
  const { addTransaction } = useBundles()

  if (!bundleId) {
    navigate('/bundles')
    return null
  }

  return (
    <Modal title="New Transaction" afterLeave={() => navigate('/bundles')}>
      <TransactionForm
        submitLabel="Add Transaction"
        getMaxBaseFee={async () => 0}
        onSubmit={(tx, signer) => {
          addTransaction(bundleId, {
            transaction: tx,
            signer,
          })
          navigate('/bundles')
        }}
      />
    </Modal>
  )
}
