import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Input } from '../Input/Input'
import { Modal } from '../Modal/Modal'
import { TransactionForm } from '../TransactionForm/TransactionForm'
import { useBundles } from './useBundles'

type BundleFormData = {
  title: string
}

export const CreateBundleModal = () => {
  const navigate = useNavigate()
  const { addBundle } = useBundles()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BundleFormData>()

  return (
    <Modal title="New Bundle" afterLeave={() => navigate('/bundles')}>
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
    </Modal>
  )
}
