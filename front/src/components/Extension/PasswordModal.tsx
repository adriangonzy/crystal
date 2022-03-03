import { useForm } from 'react-hook-form'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'
import { Modal } from '../Modal/Modal'

type PasswordFormData = {
  password: string
}

export interface PasswordModalProps {
  title: string
  cta: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (password: string) => void
}

export const PasswordModal = ({
  title,
  cta,
  isOpen,
  onClose,
  onSubmit,
}: PasswordModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>()

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <form>
        <Input
          type="password"
          label="Password"
          {...register('password', {
            required: true,
          })}
          error={errors.password}
          errorMessage="Required"
          defaultValue={`New Bundle`}
        />
        <br />
        <Button
          onClick={(e) => {
            e.preventDefault()
            handleSubmit((data: PasswordFormData) => {
              onSubmit(data.password)
            })()
          }}
        >
          {cta}
        </Button>
      </form>
    </Modal>
  )
}
