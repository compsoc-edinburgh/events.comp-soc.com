import { useState } from 'react'
import type { CustomField } from '@events.comp-soc.com/shared'
import { Button } from '@/components/ui/button.tsx'
import { useCommitteeAuth } from '@/lib/auth.ts'
import EventRegistrationFormDialog from '@/components/forms/event-registration-form-dialog.tsx'

function RegisterEventButton({
  form,
  title,
}: {
  form: Array<CustomField>
  title: string
}) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useCommitteeAuth()

  return (
    <>
      <Button onClick={() => setOpen(!open)} disabled={!isAuthenticated}>
        Register Now
      </Button>
      <EventRegistrationFormDialog
        onFormSubmit={() => {}}
        formStructure={form}
        isOpen={open}
        onOpenChange={() => setOpen(!open)}
        eventTitle={title}
      />
    </>
  )
}

export default RegisterEventButton
