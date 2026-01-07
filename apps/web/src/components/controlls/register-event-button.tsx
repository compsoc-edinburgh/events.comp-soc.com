import { useState } from 'react'
import { RegistrationContractSchema } from '@events.comp-soc.com/shared'
import type {
  CustomField,
  RegistrationFormAnswer,
} from '@events.comp-soc.com/shared'
import { Button } from '@/components/ui/button.tsx'
import { useCommitteeAuth } from '@/lib/auth.ts'
import EventRegistrationFormDialog from '@/components/forms/event-registration-form-dialog.tsx'
import { useCreateRegistration } from '@/lib/hooks/use-create-registration.tsx'

function RegisterEventButton({
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
  const { createRegistration, isCreating } = useCreateRegistration(
    eventId,
    title,
  )

  const handleSubmit = (value: RegistrationFormAnswer) => {
    const data = RegistrationContractSchema.parse({
      answers: value,
    })
    createRegistration(data)
    setOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        disabled={!isAuthenticated || disabled}
      >
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

export default RegisterEventButton
