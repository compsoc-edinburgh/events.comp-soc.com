import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { RegistrationContractSchema } from '@events.comp-soc.com/shared'
import type {
  CustomField,
  RegistrationFormAnswer,
} from '@events.comp-soc.com/shared'
import { Button } from '@/components/ui/button.tsx'
import { useCommitteeAuth } from '@/lib/auth.ts'
import EventRegistrationFormDialog from '@/components/forms/event-registration-form-dialog.tsx'
import { useCreateRegistration } from '@/lib/hooks/registrations/use-create-registration.tsx'

function CreateRegisterEventButton({
  form,
  title,
  eventId,
  disabled,
}: {
  form: Array<CustomField>
  title: string
  eventId: string
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useCommitteeAuth()
  const navigate = useNavigate()
  const { createRegistration, isCreating } = useCreateRegistration(
    eventId,
    title,
  )

  const handleClick = () => {
    if (!isAuthenticated) {
      void navigate({ to: '/sign-in/$' })
      return
    }
    setOpen(!open)
  }

  const handleSubmit = (value: RegistrationFormAnswer) => {
    const data = RegistrationContractSchema.parse({
      answers: value,
    })
    createRegistration(data)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={handleClick} disabled={disabled}>
        Register Now
      </Button>
      <EventRegistrationFormDialog
        onFormSubmit={handleSubmit}
        formStructure={form}
        isLoading={isCreating}
        isOpen={open}
        onOpenChange={() => setOpen(!open)}
        eventTitle={title}
      />
    </>
  )
}

export default CreateRegisterEventButton
